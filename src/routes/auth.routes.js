const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter, registerRateLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.post('/register', authRateLimiter, registerRateLimiter, authController.register);
router.post('/verify-otp', authRateLimiter, authController.verifyOtp);
router.post('/resend-otp', authRateLimiter, authController.resendOtp);
router.post('/login', authRateLimiter, authController.login);
router.post('/google', authRateLimiter, authController.googleLogin);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/update-name', authenticate, authController.updateName);
router.put('/change-password', authenticate, authController.changePassword);
router.put('/set-password', authenticate, authController.setPassword);

module.exports = router;
