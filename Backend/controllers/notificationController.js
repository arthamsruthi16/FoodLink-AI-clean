const { v4: uuidv4 } = require('uuid');
const { createNotification, getNotificationsByUserId, getNotifications, markNotificationRead } = require('../models/notificationModel');

async function getNotificationsHandler(req, res) {
  const userId = req.query.userId || req.user?.id;
  const notifications = userId ? await getNotificationsByUserId(userId) : await getNotifications();
  const unreadCount = notifications.filter((notif) => !notif.read).length;
  res.json({ notifications, unreadCount });
}

async function createNotificationHandler(req, res) {
  const { title, message, type = 'system', linkId, userId } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Notification title and message are required.' });
  }

  const notification = {
    id: uuidv4(),
    userId: userId || req.user?.id || 'all',
    title,
    message,
    type,
    read: false,
    timestamp: new Date().toISOString(),
    linkId: linkId || null
  };

  const created = await createNotification(notification);
  res.status(201).json({ notification: created });
}

async function markAsRead(req, res) {
  const id = req.params.id;
  const updated = await markNotificationRead(id);
  res.json({ notification: updated });
}

module.exports = {
  getNotifications: getNotificationsHandler,
  createNotification: createNotificationHandler,
  markAsRead
};
