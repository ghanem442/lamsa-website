const nodemailer = require('nodemailer');
const env = require('../config/env');

// Create transporter
let transporter = null;

function getTransporter() {
  if (!transporter && env.EMAIL_USER && env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otpCode - 4-digit OTP code
 * @returns {Promise<void>}
 */
async function sendOtpEmail(email, otpCode) {
  const transporter = getTransporter();
  
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  const mailOptions = {
    from: `"متجر لمسة LAMSA" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'رمز التحقق - متجر لمسة',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #5C0E14 0%, #200407 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #5C0E14 0%, #8B1520 100%);
            padding: 30px;
            text-align: center;
          }
          .logo {
            width: 80px;
            height: 80px;
            background: #D4AF37;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
          }
          .header h1 {
            color: #D4AF37;
            margin: 0;
            font-size: 1.8rem;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .greeting {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 20px;
          }
          .otp-box {
            background: linear-gradient(135deg, #5C0E14 0%, #8B1520 100%);
            color: #D4AF37;
            font-size: 2.5rem;
            font-weight: bold;
            letter-spacing: 12px;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(92, 14, 20, 0.3);
          }
          .message {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 20px 0;
          }
          .warning {
            background: #FFF3CD;
            border-right: 4px solid #D4AF37;
            padding: 15px;
            border-radius: 8px;
            color: #856404;
            font-size: 0.9rem;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 0.85rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌹</div>
            <h1>متجر لمسة LAMSA</h1>
          </div>
          
          <div class="content">
            <p class="greeting">مرحباً بك في متجر لمسة! 🌟</p>
            
            <p class="message">
              لإتمام إنشاء حسابك، يرجى إدخال رمز التحقق التالي:
            </p>
            
            <div class="otp-box">${otpCode}</div>
            
            <p class="message">
              هذا الرمز صالح لمدة <strong>5 دقائق</strong> فقط.
            </p>
            
            <div class="warning">
              ⚠️ <strong>تنبيه أمني:</strong> لا تشارك هذا الرمز مع أي شخص. فريق لمسة لن يطلب منك هذا الرمز أبداً.
            </div>
            
            <p class="message">
              إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2026 متجر لمسة (LAMSA) - جميع الحقوق محفوظة</p>
            <p style="margin: 5px 0;">تجربة تسوق فاخرة لمنتجات العناية والجمال</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  // Send email async (non-blocking)
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOtpEmail
};
