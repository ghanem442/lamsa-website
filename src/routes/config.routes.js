const express = require('express');
const router = express.Router();
const env = require('../config/env');

/**
 * GET /api/config/public
 * Returns public configuration (client IDs, etc.)
 */
router.get('/public', (req, res) => {
  res.json({
    success: true,
    data: {
      googleClientId: env.GOOGLE_CLIENT_ID || null
    }
  });
});

module.exports = router;
