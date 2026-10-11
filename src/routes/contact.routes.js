/**
 * Contact Routes
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { contactRateLimiter } = require('../middleware/rateLimiter');

// Public: Submit contact message (rate limited)
router.post(
  '/',
  contactRateLimiter,
  contactController.submitContactMessage
);

module.exports = router;
