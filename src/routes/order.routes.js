const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateOptional } = require('../middleware/auth');
const { orderRateLimiter } = require('../middleware/rateLimiter');

// POST /api/orders - Create order (guest or authenticated)
router.post('/', orderRateLimiter, authenticateOptional, orderController.createOrder);

// GET /api/orders/:id - Get order by ID (with optional guest lookup)
router.get('/:id', authenticateOptional, orderController.getOrderById);

module.exports = router;
