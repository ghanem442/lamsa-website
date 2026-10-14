const rateLimit = require('express-rate-limit');

// Rate limiter for order creation (configurable from .env)
// Counts ALL requests (successful + failed) to prevent order flooding
const orderRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.ORDER_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.ORDER_RATE_LIMIT_MAX) || 5,
  skipSuccessfulRequests: false, // Count ALL requests to prevent spam
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
// Only counts failed login attempts per IP (skipSuccessfulRequests: true)
// Default: 10 attempts per 15 minutes (configurable via .env)
const authRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  skipSuccessfulRequests: true, // Only count failed login/register attempts
  standardHeaders: true, // Sends RateLimit-* headers
  legacyHeaders: false,
  handler: (req, res) => {
    const windowMinutes = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15;
    const retryAfter = res.getHeader('Retry-After') || windowMinutes * 60; // seconds
    const waitMinutes = Math.ceil(retryAfter / 60);
    
    res.status(429).json({
      success: false,
      message: `عدد محاولات تسجيل الدخول الفاشلة كبير جداً. يرجى المحاولة بعد ${waitMinutes} دقيقة`,
      retryAfter: retryAfter
    });
  }
});

// Separate stricter rate limiter for registration only
// Counts SUCCESSFUL registrations to prevent mass account creation
// Default: 3 successful registrations per IP per 24 hours (configurable via .env)
const registerRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.AUTH_REGISTER_LIMIT_WINDOW_HOURS) || 24) * 60 * 60 * 1000,
  max: parseInt(process.env.AUTH_REGISTER_LIMIT_MAX) || 3,
  skipSuccessfulRequests: false, // Count successful registrations
  skipFailedRequests: true, // Don't count failed registrations (handled by authRateLimiter)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const windowHours = parseInt(process.env.AUTH_REGISTER_LIMIT_WINDOW_HOURS) || 24;
    res.status(429).json({
      success: false,
      message: `تم تجاوز الحد الأقصى لإنشاء الحسابات. يرجى المحاولة بعد ${windowHours} ساعة`
    });
  }
});

// Rate limiter for contact form
// Counts ALL submissions (successful + failed) to prevent spam messages
const contactRateLimiter = rateLimit({
  windowMs: (parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES) || 10) * 60 * 1000,
  max: parseInt(process.env.CONTACT_RATE_LIMIT_MAX) || 3,
  skipSuccessfulRequests: false, // Count ALL submissions to prevent spam
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
  registerRateLimiter,
  contactRateLimiter
};
