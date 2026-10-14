/**
 * Contact Controller
 * Handles contact form submissions
 */

const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const { z } = require('zod');

// Contact message schema
const contactMessageSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم يجب ألا يتجاوز 100 حرف'),
  email: z.string().email('البريد الإلكتروني غير صحيح').max(100, 'البريد الإلكتروني يجب ألا يتجاوز 100 حرف').optional().nullable(),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح').max(20, 'رقم الهاتف يجب ألا يتجاوز 20 رقم').optional().nullable(),
  subject: z.string().max(200, 'الموضوع يجب ألا يتجاوز 200 حرف').optional().nullable(),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل').max(2000, 'الرسالة يجب ألا تتجاوز 2000 حرف')
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
          email: validatedData.email || '', // Empty string instead of null
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
