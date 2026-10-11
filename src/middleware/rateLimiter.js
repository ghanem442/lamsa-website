const rateLimit = require('express-rate-limit');

// Rate limiter for order creation (configurable from .env)
const orderRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.ORDER_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.ORDER_RATE_LIMIT_MAX) || 5,
  message: (req, res) => {
    const windowMinutes = parseInt(process.env.ORDER_RATE_LIMIT_WINDOW_MINUTES) || 15;
    return {
      success: false,
      message: `عدد محاولات الطلب كبير، برجاء المحاولة بعد ${windowMinutes} دقيقة أو التواصل معنا`
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const windowMinutes = parseInt(process.env.ORDER_RATE_LIMIT_WINDOW_MINUTES) || 15;
    res.status(429).json({
      success: false,
      message: `عدد محاولات الطلب كبير، برجاء المحاولة بعد ${windowMinutes} دقيقة أو التواصل معنا`
    });
  }
});

// Rate limiter for authentication (login/register)
// Stricter than order limiter to prevent brute force attacks
const authRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const windowMinutes = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15;
    res.status(429).json({
      success: false,
      message: `عدد محاولات تسجيل الدخول كبير جداً. برجاء المحاولة بعد ${windowMinutes} دقيقة`
    });
  }
});

// Rate limiter for contact form
// Prevent spam submissions
const contactRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES) || 10) * 60 * 1000,
  max: parseInt(process.env.CONTACT_RATE_LIMIT_MAX) || 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const windowMinutes = parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES) || 10;
    res.status(429).json({
      success: false,
      message: `عدد محاولات الإرسال كبير، برجاء المحاولة بعد ${windowMinutes} دقائق`
    });
  }
});

module.exports = {
  orderRateLimiter,
  authRateLimiter,
  contactRateLimiter
};
