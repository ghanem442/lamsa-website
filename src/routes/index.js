const express = require('express');
const router = express.Router();
const productRoutes = require('./product.routes');
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes');
const settingsRoutes = require('./settings.routes');
const contactRoutes = require('./contact.routes');
const configRoutes = require('./config.routes');
const scentRoutes = require('./scent.routes');

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
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/contact', contactRoutes);
router.use('/config', configRoutes);
router.use('/scents', scentRoutes);

module.exports = router;
