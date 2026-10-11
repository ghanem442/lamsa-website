/**
 * Admin Contact Messages Controller
 */

const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');

/**
 * GET /api/admin/messages
 * Get all contact messages (admin only)
 */
async function getAllMessages(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    const { 
      page = 1, 
      limit = 50, 
      isRead 
    } = req.query;
    
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    
    const where = {};
    
    if (isRead !== undefined && isRead !== 'all') {
      where.isRead = isRead === 'true';
    }
    
    const [total, messages] = await withRetry(async () => {
      return await Promise.all([
        prisma.contactMessage.count({ where }),
        prisma.contactMessage.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: [
            { isRead: 'asc' },  // Unread first
            { createdAt: 'desc' }
          ]
        })
      ]);
    });
    
    res.json({
      success: true,
      data: {
        messages,
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
 * PATCH /api/admin/messages/:id/read
 * Mark message as read/unread (admin only)
 */
async function updateMessageReadStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    
    if (typeof isRead !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isRead must be a boolean'
      });
    }
    
    const message = await withRetry(async () => {
      return await prisma.contactMessage.update({
        where: { id },
        data: { isRead }
      });
    });
    
    res.json({
      success: true,
      message: isRead ? 'تم تحديد الرسالة كمقروءة' : 'تم تحديد الرسالة كغير مقروءة',
      data: message
    });
    
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }
    next(error);
  }
}

/**
 * GET /api/admin/messages/stats
 * Get messages statistics (admin only)
 */
async function getMessagesStats(req, res, next) {
  try {
    const [total, unread] = await withRetry(async () => {
      return await Promise.all([
        prisma.contactMessage.count(),
        prisma.contactMessage.count({
          where: { isRead: false }
        })
      ]);
    });
    
    res.json({
      success: true,
      data: {
        total,
        unread,
        read: total - unread
      }
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMessages,
  updateMessageReadStatus,
  getMessagesStats
};
