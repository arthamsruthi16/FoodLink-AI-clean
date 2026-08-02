const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getNotifications, createNotification, markAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getNotifications);
router.post('/', authenticateToken, createNotification);
router.put('/:id/read', authenticateToken, markAsRead);

module.exports = router;
