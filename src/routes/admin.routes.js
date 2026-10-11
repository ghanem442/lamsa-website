const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/admin.product.controller');
const adminOrderController = require('../controllers/admin.order.controller');
const adminContactController = require('../controllers/admin.contact.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(requireAdmin);

// ═══════════════════════════════════
// PRODUCT MANAGEMENT
// ═══════════════════════════════════

// Product CRUD
router.get('/products', adminProductController.getAllProducts);
router.post('/products', adminProductController.createProduct);
router.put('/products/:id', adminProductController.updateProduct);
router.delete('/products/:id', adminProductController.deleteProduct);

// Image upload
router.post('/products/upload-image', upload.single('image'), adminProductController.uploadImage);

// CSV import/export
router.post('/products/import-csv', upload.single('csv'), adminProductController.importCSV);
router.get('/products/export-csv', adminProductController.exportCSV);
router.get('/products/csv-template', adminProductController.getCSVTemplate);

// ═══════════════════════════════════
// ORDER MANAGEMENT
// ═══════════════════════════════════

// Orders stats
router.get('/orders/stats', adminOrderController.getOrdersStats);

// Orders CRUD
router.get('/orders', adminOrderController.getAllOrders);
router.get('/orders/:id', adminOrderController.getOrderById);
router.patch('/orders/:id/status', adminOrderController.updateOrderStatus);

// ═══════════════════════════════════
// CONTACT MESSAGES
// ═══════════════════════════════════

// Messages stats
router.get('/messages/stats', adminContactController.getMessagesStats);

// Messages CRUD
router.get('/messages', adminContactController.getAllMessages);
router.patch('/messages/:id/read', adminContactController.updateMessageReadStatus);

module.exports = router;
