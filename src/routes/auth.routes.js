const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter, registerRateLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authRateLimiter, registerRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);

// Protected routes
router.get('/me', authenticate, authController.getMe);

module.exports = router;
