const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Featured products: /api/products/featured
router.get('/featured', productController.getFeaturedProducts);

// List products with filters: /api/products
router.get('/', productController.getProducts);

// Single product details: /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;
