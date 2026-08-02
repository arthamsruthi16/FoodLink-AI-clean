const { firestore } = require('../config/firebase');

/**
 * Pickup request model operations against Firestore.
 */
const pickupCollection = firestore.collection('pickups');

async function createPickup(pickupRequest) {
  const docRef = pickupCollection.doc(pickupRequest.id);
  await docRef.set(pickupRequest);
  return { id: docRef.id, ...pickupRequest };
}

async function getPickupById(id) {
  const doc = await pickupCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getPickupByTrackingNumber(trackingNumber) {
  const snapshot = await pickupCollection.where('trackingNumber', '==', trackingNumber).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function updatePickup(id, updates) {
  await pickupCollection.doc(id).update(updates);
  const doc = await pickupCollection.doc(id).get();
  return { id: doc.id, ...doc.data() };
}

async function getPickupsByNgo(ngoId) {
  const snapshot = await pickupCollection.where('ngoId', '==', ngoId).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  createPickup,
  getPickupById,
  getPickupByTrackingNumber,
  updatePickup,
  getPickupsByNgo
};
