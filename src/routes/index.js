const express = require('express');
const router = express.Router();
const productRoutes = require('./product.routes');
const authRoutes = require('./auth.routes');

/**
 * GET /api/health
 * Public health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'LAMSA E-Commerce Backend API',
    version: '1.0.0'
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

module.exports = router;
