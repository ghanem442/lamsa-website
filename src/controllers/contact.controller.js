/**
 * Contact Controller
 * Handles contact form submissions
 */

const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const { z } = require('zod');

// Contact message schema
const contactMessageSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب').max(100),
  email: z.string().email('البريد الإلكتروني غير صحيح').max(100),
  phone: z.string().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل').max(2000)
});

/**
 * POST /api/contact
 * Submit contact message (public)
 */
async function submitContactMessage(req, res, next) {
  try {
    const validatedData = contactMessageSchema.parse(req.body);
    
    const message = await withRetry(async () => {
      return await prisma.contactMessage.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          subject: validatedData.subject || null,
          message: validatedData.message,
          isRead: false
        }
      });
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!',
      data: {
        id: message.id,
        createdAt: message.createdAt
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
    
    console.error('[Contact] Submit error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال الرسالة. يرجى المحاولة لاحقاً.'
    });
  }
}

module.exports = {
  submitContactMessage
};
