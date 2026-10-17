const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateOptional } = require('../middleware/auth');
const { orderRateLimiter } = require('../middleware/rateLimiter');

// POST /api/orders - Create order (guest or authenticated)
router.post('/', orderRateLimiter, authenticateOptional, orderController.createOrder);

// GET /api/orders/:id - Get order by ID (with optional guest lookup)
router.get('/:id', authenticateOptional, orderController.getOrderById);

// DEV ONLY: Clear rate limit for testing (remove in production)
if (process.env.NODE_ENV === 'development') {
  router.post('/dev/clear-rate-limit', (req, res) => {
    try {
      // Reset the rate limiter store
      if (orderRateLimiter.resetKey) {
        const key = req.body.key || req.ip;
        orderRateLimiter.resetKey(key);
      }
      res.json({ 
        success: true, 
        message: 'Rate limit cleared for development testing' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to clear rate limit',
        error: error.message 
      });
    }
  });
}

module.exports = router;
