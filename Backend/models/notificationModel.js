const { firestore } = require('../config/firebase');

/**
 * Notification model operations against Firestore.
 */
const notificationCollection = firestore.collection('notifications');

async function createNotification(notificationData) {
  const docRef = notificationCollection.doc(notificationData.id);
  await docRef.set(notificationData);
  return { id: docRef.id, ...notificationData };
}

async function getNotificationsByUserId(userId) {
  const snapshot = await notificationCollection
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getNotifications(filters = {}) {
  let query = notificationCollection.orderBy('timestamp', 'desc');

  if (filters.userId) {
    query = query.where('userId', '==', filters.userId);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function markNotificationRead(id) {
  await notificationCollection.doc(id).update({ read: true });
  const doc = await notificationCollection.doc(id).get();
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  createNotification,
  getNotificationsByUserId,
  getNotifications,
  markNotificationRead
};
