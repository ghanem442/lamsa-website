const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Public health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'LAMSA E-Commerce Backend API',
    version: '1.0.0'
  });
});

module.exports = router;
