/**
 * Settings Routes
 */

const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public: Get perfume prices
router.get('/perfume-prices', settingsController.getPerfumePrices);

// Admin only: Update perfume prices
router.put(
  '/perfume-prices',
  authenticate,
  requireAdmin,
  settingsController.updatePerfumePrices
);

module.exports = router;
