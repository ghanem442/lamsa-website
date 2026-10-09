const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const { z } = require('zod');

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
  notes: z.string().max(1000).optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'معرف المنتج مطلوب'),
      quantity: z.number().int().min(1, 'الكمية يجب أن تكون على الأقل 1').max(50, 'الكمية القصوى 50')
    })
  ).min(1, 'يجب إضافة منتج واحد على الأقل').max(30, 'الحد الأقصى 30 منتج في الطلب')
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
        // 1. Load all products and check stock
        const productIds = validatedData.items.map(item => item.productId);
        const products = await tx.product.findMany({
          where: {
            id: { in: productIds }
          }
        });
        
        // Map products by ID
        const productMap = {};
        products.forEach(p => {
          productMap[p.id] = p;
        });
        
        // 2. Validate stock and calculate prices
        let subtotal = 0;
        const orderItems = [];
        
        for (const item of validatedData.items) {
          const product = productMap[item.productId];
          
          if (!product) {
            throw new Error(`المنتج غير موجود: ${item.productId}`);
          }
          
          if (product.stockQty < item.quantity) {
            throw new Error(
              `الكمية المطلوبة من "${product.nameAr}" غير متوفرة في المخزون. المتاح: ${product.stockQty}`
            );
          }
          
          const lineTotal = product.price * item.quantity;
          subtotal += lineTotal;
          
          orderItems.push({
            productId: product.id,
            quantity: item.quantity,
            unitPrice: product.price,
            productName: product.nameAr,
            productImage: product.imageUrl,
            productEmoji: product.emoji
          });
        }
        
        // 3. Calculate total
        const shippingFee = 35;
        const totalAmount = subtotal + shippingFee;
        
        // 4. Generate order number
        const orderNumber = await generateOrderNumber();
        
        // 5. Create order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId,
            customerName: validatedData.customerName,
            phone: validatedData.customerPhone,    // Map API field to schema field
            city: validatedData.governorate,        // Map API field to schema field
            address: validatedData.address,
            paymentMethod: validatedData.paymentMethod,
            notes: validatedData.notes || null,
            subtotal,
            shippingFee,
            totalAmount,                            // Schema field name
            orderStatus: 'pending',                 // Schema field name
            items: {
              create: orderItems
            }
          },
          include: {
            items: true
          }
        });
        
        // 6. Decrease stock
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
        items: order.items
      }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors?.[0];
      const errorMsg = firstError?.message || 'خطأ في التحقق من البيانات';
      return res.status(400).json({
        success: false,
        message: errorMsg
      });
    }
    
    if (error.message && (error.message.includes('المنتج') || error.message.includes('الكمية') || error.message.includes('المخزون'))) {
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
