const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const { z } = require('zod');
const { 
  PERFUME_SIZES, 
  PERFUME_CONCENTRATIONS, 
  PERFUME_SETTINGS_KEY,
  ALLOWED_SCENTS,
  MAX_CUSTOM_NAME_LENGTH,
  MAX_NOTES_LENGTH
} = require('../constants/perfume');

// Egyptian phone validation
const egyptianPhoneSchema = z.string().regex(
  /^(\+20|0)?1[0125]\d{8}$/,
  'رقم الهاتف يجب أن يكون رقم مصري صحيح'
);

// Order creation schema
const createOrderSchema = z.object({
  customerName: z.string().min(2, 'الاسم مطلوب').max(100),
  customerPhone: egyptianPhoneSchema,
  governorate: z.string().min(2, 'المحافظة مطلوبة').max(100),
  address: z.string().min(5, 'العنوان مطلوب').max(500),
  paymentMethod: z.enum(['cod', 'instapay', 'voda']),
  notes: z.string().max(MAX_NOTES_LENGTH, `الملاحظات يجب ألا تتجاوز ${MAX_NOTES_LENGTH} حرف`).optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'معرف المنتج مطلوب'),
      quantity: z.number().int().min(1, 'الكمية يجب أن تكون على الأقل 1').max(50, 'الكمية القصوى 50')
    })
  ).min(0, 'قائمة المنتجات مطلوبة').max(30, 'الحد الأقصى 30 منتج في الطلب'),
  
  // Custom perfume fields (optional)
  customPerfume: z.object({
    customName: z.string()
      .min(1, 'اسم العطر مطلوب')
      .max(MAX_CUSTOM_NAME_LENGTH, `اسم العطر يجب ألا يتجاوز ${MAX_CUSTOM_NAME_LENGTH} حرف`)
      .refine(
        (name) => ALLOWED_SCENTS.includes(name),
        { message: 'اسم العطر غير مسموح به. يرجى اختيار عطر من القائمة المتاحة' }
      ),
    topNote: z.string().min(1).max(100, 'المقدمة يجب ألا تتجاوز 100 حرف'),
    heartNote: z.string().min(1).max(100, 'القلب يجب ألا تتجاوز 100 حرف'),
    baseNote: z.string().min(1).max(100, 'القاعدة يجب ألا تتجاوز 100 حرف'),
    size: z.enum(PERFUME_SIZES, { 
      errorMap: () => ({ message: `الحجم يجب أن يكون أحد: ${PERFUME_SIZES.join(', ')}` }) 
    }),
    concentration: z.enum(PERFUME_CONCENTRATIONS, {
      errorMap: () => ({ message: `التركيز يجب أن يكون أحد: ${PERFUME_CONCENTRATIONS.join(', ')}` })
    })
    // calculatedPrice removed - server calculates from settings
  }).optional()
});

/**
 * Generate unique order number
 */
async function generateOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `LMS-${random}`;
  
  // Check if exists
  const existing = await withRetry(async () => {
    return await prisma.order.findUnique({
      where: { orderNumber }
    });
  });
  
  if (existing) {
    return generateOrderNumber(); // Retry
  }
  
  return orderNumber;
}

/**
 * POST /api/orders
 * Create a new order (guest or authenticated)
 */
async function createOrder(req, res, next) {
  try {
    // Validate request body
    const validatedData = createOrderSchema.parse(req.body);
    
    // Get user ID if authenticated
    const userId = req.user?.id || null;
    
    // Start transaction
    const order = await withRetry(async () => {
      return await prisma.$transaction(async (tx) => {
        let subtotal = 0;
        const orderItems = [];
        let calculatedPerfumePrice = null;
        
        // Check if this is a custom perfume order or regular products order
        const isCustomPerfumeOrder = validatedData.customPerfume && !validatedData.items.length;
        
        if (isCustomPerfumeOrder) {
          // Custom perfume order - calculate price from settings
          const perfumeSettings = await tx.setting.findUnique({
            where: { key: PERFUME_SETTINGS_KEY }
          });
          
          if (!perfumeSettings) {
            throw new Error('أسعار العطور غير متوفرة في النظام');
          }
          
          const prices = perfumeSettings.value;
          const { size, concentration } = validatedData.customPerfume;
          
          // Validate and get price
          if (!prices[size] || !prices[size][concentration]) {
            throw new Error(`سعر غير متوفر للحجم ${size} والتركيز ${concentration}`);
          }
          
          calculatedPerfumePrice = prices[size][concentration];
          subtotal = calculatedPerfumePrice;
        } else {
          // Regular products order
          // 1. Load all products WITH ROW LOCKS to prevent race conditions
          const productIds = validatedData.items.map(item => item.productId);
          
          // Use raw query to get row-level locks (FOR UPDATE)
          // This ensures no other transaction can read/write these products until we commit
          const products = await tx.$queryRaw`
            SELECT * FROM products 
            WHERE id = ANY(${productIds}::uuid[])
            FOR UPDATE
          `;
          
          // Map products by ID
          const productMap = {};
          products.forEach(p => {
            productMap[p.id] = p;
          });
          
          // 2. Validate stock and calculate prices
          for (const item of validatedData.items) {
            const product = productMap[item.productId];
            
            if (!product) {
              throw new Error(`المنتج غير موجود: ${item.productId}`);
            }
            
            // Critical: check stock AFTER acquiring lock
            if (product.stock_qty < item.quantity) {
              throw new Error(
                `الكمية المطلوبة من "${product.name_ar}" غير متوفرة في المخزون. المتاح: ${product.stock_qty}`
              );
            }
            
            const lineTotal = product.price * item.quantity;
            subtotal += lineTotal;
            
            orderItems.push({
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.price,
              productName: product.name_ar,
              productImage: product.image_url,
              productEmoji: product.emoji
            });
          }
        }
        
        // 3. Calculate total
        const shippingFee = 35;
        const totalAmount = subtotal + shippingFee;
        
        // 4. Generate order number
        const orderNumber = await generateOrderNumber();
        
        // 5. Create order
        const orderData = {
          orderNumber,
          userId,
          customerName: validatedData.customerName,
          phone: validatedData.customerPhone,
          city: validatedData.governorate,
          address: validatedData.address,
          paymentMethod: validatedData.paymentMethod,
          notes: validatedData.notes || null,
          subtotal,
          shippingFee,
          totalAmount,
          orderStatus: 'pending'
        };
        
        // Add items only if there are products
        if (orderItems.length > 0) {
          orderData.items = {
            create: orderItems
          };
        }
        
        // Add custom perfume if provided
        if (validatedData.customPerfume) {
          orderData.customPerfume = {
            create: {
              userId,
              customName: validatedData.customPerfume.customName,
              topNote: validatedData.customPerfume.topNote,
              heartNote: validatedData.customPerfume.heartNote,
              baseNote: validatedData.customPerfume.baseNote,
              size: validatedData.customPerfume.size,
              concentration: validatedData.customPerfume.concentration,
              calculatedPrice: calculatedPerfumePrice // Server-calculated price
            }
          };
        }
        
        const newOrder = await tx.order.create({
          data: orderData,
          include: {
            items: true,
            customPerfume: true
          }
        });
        
        // 6. Decrease stock (only for regular products)
        if (!isCustomPerfumeOrder) {
          for (const item of validatedData.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQty: {
                  decrement: item.quantity
                }
              }
            });
          }
        }
        
        return newOrder;
      });
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.phone,
        governorate: order.city,
        address: order.address,
        total: order.totalAmount,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        status: order.orderStatus,
        items: order.items,
        customPerfume: order.customPerfume || null
      }
    });
    
  } catch (error) {
    // Enhanced Zod validation error handling
    if (error instanceof z.ZodError) {
      // Map Zod errors to Arabic field-level errors
      const fieldErrors = error.issues.map(err => {  // Changed from error.errors to error.issues
        const fieldPath = err.path.join('.');
        let fieldName = fieldPath;
        let message = err.message;
        
        // Map field paths to Arabic names
        const fieldNameMap = {
          'customerName': 'اسم العميل',
          'customerPhone': 'رقم الهاتف',
          'governorate': 'المحافظة',
          'address': 'العنوان',
          'notes': 'الملاحظات',
          'customPerfume.customName': 'اسم العطر',
          'customPerfume.topNote': 'المقدمة',
          'customPerfume.heartNote': 'القلب',
          'customPerfume.baseNote': 'القاعدة',
          'customPerfume.size': 'الحجم',
          'customPerfume.concentration': 'التركيز'
        };
        
        const arabicFieldName = fieldNameMap[fieldPath] || fieldName;
        
        return {
          field: fieldPath,
          fieldName: arabicFieldName,
          message: message
        };
      });
      
      console.log('[Order] Validation failed:', JSON.stringify(fieldErrors, null, 2));
      
      const firstError = fieldErrors[0];
      
      return res.status(400).json({
        success: false,
        message: firstError ? `${firstError.fieldName}: ${firstError.message}` : 'خطأ في التحقق من البيانات',
        errors: fieldErrors
      });
    }
    
    if (error.message && (error.message.includes('المنتج') || error.message.includes('الكمية') || error.message.includes('المخزون') || error.message.includes('أسعار'))) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    console.error('[Order] Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر. يرجى المحاولة لاحقاً أو التواصل معنا.'
    });
  }
}

/**
 * GET /api/orders/:id
 * Get order by ID (owner or admin only)
 */
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const { orderNumber, phone } = req.query;
    
    let where = {};
    
    // Guest lookup by order number + phone
    if (orderNumber && phone) {
      where = {
        orderNumber,
        phone
      };
    } 
    // Lookup by ID
    else {
      where = { id };
      
      // Check authorization (owner or admin)
      if (req.user?.role !== 'admin') {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'يجب تسجيل الدخول'
          });
        }
        where.userId = req.user.id;
      }
    }
    
    const order = await withRetry(async () => {
      return await prisma.order.findFirst({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nameAr: true,
                  nameEn: true,
                  imageUrl: true,
                  emoji: true
                }
              }
            }
          },
          customPerfume: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrderById
};
