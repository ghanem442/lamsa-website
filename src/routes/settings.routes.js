const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public endpoints
router.get('/shipping', settingsController.getShippingFee);
router.get('/perfume-prices', settingsController.getPerfumePrices);

// Admin endpoints
router.patch('/admin/shipping', authenticate, requireAdmin, settingsController.updateShippingFee);
router.put('/perfume-prices', authenticate, requireAdmin, settingsController.updatePerfumePrices);

module.exports = router;
