const { firestore } = require('../config/firebase');

/**
 * User model operations against Firestore.
 */
const usersCollection = firestore.collection('users');

async function createUser(userData) {
  const userRef = usersCollection.doc(userData.id);
  await userRef.set(userData);
  return userRef;
}

async function getUserByEmail(email) {
  const snapshot = await usersCollection.where('email', '==', email.toLowerCase()).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function getUserByAuthUid(authUid) {
  const snapshot = await usersCollection.where('authUid', '==', authUid).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function listUsers(limit = 100) {
  const snapshot = await usersCollection.limit(limit).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getUserById(userId) {
  const doc = await usersCollection.doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function updateUser(userId, updates) {
  await usersCollection.doc(userId).update(updates);
  const doc = await usersCollection.doc(userId).get();
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByAuthUid,
  listUsers,
  getUserById,
  updateUser
};
