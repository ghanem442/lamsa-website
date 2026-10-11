/**
 * Admin Contact Messages Routes
 */

const express = require('express');
const router = express.Router();
const adminContactController = require('../controllers/admin.contact.controller');

// Get all messages
router.get('/', adminContactController.getAllMessages);

// Get messages stats
router.get('/stats', adminContactController.getMessagesStats);

// Mark as read/unread
router.patch('/:id/read', adminContactController.updateMessageReadStatus);

module.exports = router;
