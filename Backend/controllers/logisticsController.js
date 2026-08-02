const { getPickupByTrackingNumber, updatePickup } = require('../models/pickupModel');
const { getFoodItemById, updateFoodItem } = require('../models/foodModel');
const { config } = require('../config');

async function dispatchPickup(req, res) {
  const { pickupId } = req.body;
  if (!pickupId) {
    return res.status(400).json({ error: 'pickupId is required.' });
  }

  const pickup = await require('../config/firebase').firestore.collection('pickups').doc(pickupId).get();
  if (!pickup.exists) {
    return res.status(404).json({ error: 'Pickup request not found.' });
  }

  const pickupData = { id: pickup.id, ...pickup.data() };
  const updatedPickup = await updatePickup(pickupData.id, {
    status: 'Courier Assigned',
    courierName: 'FoodLink Express',
    courierPhone: '+18005551234',
    estimatedArrivalMinutes: 18
  });

  res.json({ pickup: updatedPickup });
}

async function trackShipment(req, res) {
  const { trackingNumber } = req.params;
  const pickup = await require('../config/firebase').firestore.collection('pickups').where('trackingNumber', '==', trackingNumber).limit(1).get();
  if (pickup.empty) {
    return res.status(404).json({ error: 'Tracking number not found.' });
  }

  const pickupDoc = pickup.docs[0];
  const data = { id: pickupDoc.id, ...pickupDoc.data() };
  const progress = [
    { status: 'Scheduled', timestamp: new Date(Date.now() - 6 * 3600000).toISOString() },
    { status: 'Courier Assigned', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
    { status: data.status || 'In Transit', timestamp: new Date().toISOString() }
  ];

  res.json({ trackingNumber, status: data.status, progress, pickup: data });
}

async function verifyQrCode(req, res) {
  const { qrCode } = req.body;
  if (!qrCode) {
    return res.status(400).json({ error: 'QR code is required.' });
  }

  const snapshot = await require('../config/firebase').firestore.collection('pickups').where('qrVerificationCode', '==', qrCode).limit(1).get();
  if (snapshot.empty) {
    return res.status(404).json({ error: 'Invalid QR code.' });
  }

  const pickupDoc = snapshot.docs[0];
  const pickupData = { id: pickupDoc.id, ...pickupDoc.data() };

  const updatedPickup = await updatePickup(pickupData.id, {
    status: 'Completed',
    completedAt: new Date().toISOString(),
    verifiedByNgo: true
  });

  const foodItem = await getFoodItemById(pickupData.foodItemId);
  if (foodItem) {
    await updateFoodItem(foodItem.id, { status: 'Completed' });
  }

  res.json({ verified: true, pickup: updatedPickup });
}

async function handleWebhook(req, res) {
  const event = req.body;
  if (!event || !event.data || !event.type) {
    return res.status(400).json({ error: 'Invalid webhook payload.' });
  }

  // Validate webhook secret header
  const webhookSecret = req.headers['x-webhook-secret'] || req.headers['x-foodlink-webhook-secret'];
  if (webhookSecret !== config.logisticsWebhookSecret) {
    return res.status(401).json({ error: 'Unauthorized webhook request.' });
  }

  const { trackingNumber, status, courierName, courierPhone } = event.data;
  const snapshot = await require('../config/firebase').firestore.collection('pickups').where('trackingNumber', '==', trackingNumber).limit(1).get();
  if (snapshot.empty) {
    return res.status(404).json({ error: 'Pickup not found.' });
  }

  const pickupDoc = snapshot.docs[0];
  const pickupData = { id: pickupDoc.id, ...pickupDoc.data() };
  const updatedPickup = await updatePickup(pickupData.id, {
    status: status || pickupData.status,
    courierName: courierName || pickupData.courierName,
    courierPhone: courierPhone || pickupData.courierPhone
  });

  res.json({ updatedPickup });
}

module.exports = {
  dispatchPickup,
  trackShipment,
  verifyQrCode,
  handleWebhook
};
