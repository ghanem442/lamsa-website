const express = require('express');
const router = express.Router();
const adminProductController = require('../controllers/admin.product.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(requireAdmin);

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

module.exports = router;
