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

module.exports = {
  orderRateLimiter
};
