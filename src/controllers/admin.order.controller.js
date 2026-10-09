const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const { z } = require('zod');

/**
 * GET /api/admin/orders
 * List all orders with pagination and filters
 */
async function getAllOrders(req, res, next) {
  try {
    // Prevent caching to always get fresh orders
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    const { 
      page = 1, 
      limit = 50, 
      status,
      search 
    } = req.query;
    
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    
    // Build where clause
    const where = {};
    
    if (status && status !== 'all') {
      where.orderStatus = status;
    }
    
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { orderNumber: { contains: searchTerm, mode: 'insensitive' } },
        { customerName: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm } },
        { whatsapp: { contains: searchTerm } }
      ];
    }
    
    const [total, ordersRaw] = await withRetry(async () => {
      return await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: [
            { orderStatus: 'asc' }, // pending first
            { createdAt: 'desc' }   // newest first
          ],
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    nameAr: true,
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
        })
      ]);
    });
    
    // Map schema fields to frontend-expected fields
    const orders = ordersRaw.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.phone,
      phone: order.phone, // alias for backwards compatibility
      whatsapp: order.whatsapp,
      governorate: order.city, // Schema has 'city', frontend expects 'governorate'
      city: order.city,
      address: order.address,
      notes: order.notes,
      paymentMethod: order.paymentMethod,
      status: order.orderStatus, // Schema has 'orderStatus', frontend expects 'status'
      orderStatus: order.orderStatus,
      total: order.totalAmount, // Schema has 'totalAmount', frontend expects 'total'
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productEmoji: item.productEmoji,
        productImage: item.productImage,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: item.product
      })),
      user: order.user
    }));
    
    res.json({
      success: true,
      data: {
        orders: orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/orders/:id
 * Get order by ID (admin only)
 */
async function getOrderById(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    const { id } = req.params;
    
    const order = await withRetry(async () => {
      return await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nameAr: true,
                  nameEn: true,
                  imageUrl: true,
                  emoji: true,
                  price: true,
                  stockQty: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
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

/**
 * PATCH /api/admin/orders/:id/status
 * Update order status
 */
async function updateOrderStatus(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة الطلب غير صالحة'
      });
    }
    
    // Get current order
    const currentOrder = await withRetry(async () => {
      return await prisma.order.findUnique({
        where: { id },
        include: {
          items: true
        }
      });
    });
    
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }
    
    // If cancelling, return stock
    if (status === 'cancelled' && currentOrder.orderStatus !== 'cancelled') {
      await withRetry(async () => {
        return await prisma.$transaction(async (tx) => {
          // Update order status
          await tx.order.update({
            where: { id },
            data: { orderStatus: status }
          });
          
          // Return stock quantities
          for (const item of currentOrder.items) {
            if (item.productId) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stockQty: {
                    increment: item.quantity
                  }
                }
              });
            }
          }
        });
      });
      
      return res.json({
        success: true,
        message: 'تم إلغاء الطلب وإرجاع الكميات للمخزون',
        data: { status }
      });
    }
    
    // Regular status update
    const updatedOrder = await withRetry(async () => {
      return await prisma.order.update({
        where: { id },
        data: { orderStatus: status }
      });
    });
    
    res.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      data: updatedOrder
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/orders/stats
 * Get orders statistics
 */
async function getOrdersStats(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    const [
      totalOrders,
      totalSales,
      todayOrders,
      monthOrders
    ] = await withRetry(async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      return await Promise.all([
        // Total orders
        prisma.order.count(),
        
        // Total sales (all delivered orders)
        prisma.order.aggregate({
          where: { orderStatus: 'delivered' },
          _sum: { totalAmount: true }
        }),
        
        // Today orders
        prisma.order.aggregate({
          where: {
            createdAt: { gte: todayStart }
          },
          _count: true,
          _sum: { totalAmount: true }
        }),
        
        // This month orders
        prisma.order.aggregate({
          where: {
            createdAt: { gte: monthStart }
          },
          _count: true,
          _sum: { totalAmount: true }
        })
      ]);
    });
    
    res.json({
      success: true,
      data: {
        totalOrders,
        totalSales: totalSales._sum.totalAmount || 0,
        todayOrders: todayOrders._count,
        todaySales: todayOrders._sum.totalAmount || 0,
        monthOrders: monthOrders._count,
        monthSales: monthOrders._sum.totalAmount || 0
      }
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersStats
};
