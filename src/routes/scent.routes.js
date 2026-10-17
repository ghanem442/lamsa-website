const express = require('express');
const router = express.Router();
const scentController = require('../controllers/scent.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', scentController.getAllScents);
router.get('/by-layer', scentController.getScentsByLayer);

// Admin routes
router.post('/', authenticate, requireAdmin, scentController.createScent);
router.put('/:id', authenticate, requireAdmin, scentController.updateScent);
router.delete('/:id', authenticate, requireAdmin, scentController.deleteScent);
router.post('/seed-defaults', authenticate, requireAdmin, scentController.seedDefaultScents);

module.exports = router;
