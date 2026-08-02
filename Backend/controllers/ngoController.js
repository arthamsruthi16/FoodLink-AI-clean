const { v4: uuidv4 } = require('uuid');
const { getFoodItemById, queryFoodItems, updateFoodItem } = require('../models/foodModel');
const { createPickup, getPickupsByNgo, getPickupById, updatePickup } = require('../models/pickupModel');
const { calculateDistanceKm } = require('../services/aiService');

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isWithinRadius(item, lat, lng, radiusKm) {
  if (lat === null || lng === null || radiusKm === null) return true;
  const distance = calculateDistanceKm(item.lat, item.lng, lat, lng);
  return distance <= radiusKm;
}

async function getNearbyDonations(req, res) {
  const lat = req.query.lat !== undefined ? parseNumber(req.query.lat, null) : null;
  const lng = req.query.lng !== undefined ? parseNumber(req.query.lng, null) : null;
  const radiusKm = req.query.radius !== undefined ? parseNumber(req.query.radius, 10) : 10;

  const filters = {
    category: req.query.category,
    status: req.query.status,
    isReserved: false,
    search: req.query.search,
    minUrgency: req.query.minUrgency
  };

  const items = await queryFoodItems(filters);
  const nearby = items.filter((item) => isWithinRadius(item, lat, lng, radiusKm));
  res.json({ foodItems: nearby });
}

async function requestFoodDonation(req, res) {
  const itemId = req.params.id;
  const item = await getFoodItemById(itemId);

  if (!item) {
    return res.status(404).json({ error: 'Food donation not found.' });
  }

  if (item.isReserved) {
    return res.status(400).json({ error: 'Food donation is already reserved.' });
  }

  const pickupRequest = {
    id: uuidv4(),
    foodItemId: item.id,
    foodName: item.foodName,
    quantity: item.quantity,
    quantityUnit: item.quantityUnit,
    restaurantId: item.restaurantId,
    restaurantName: item.restaurantName,
    restaurantAddress: item.restaurantAddress,
    restaurantLat: item.lat,
    restaurantLng: item.lng,
    ngoId: req.user.id,
    ngoName: req.user.orgName || req.user.name,
    ngoAddress: req.user.address || '',
    ngoLat: Number(req.user.lat || 0),
    ngoLng: Number(req.user.lng || 0),
    status: 'Requested',
    trackingNumber: `NGO-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    courierName: '',
    courierPhone: '',
    estimatedArrivalMinutes: null,
    scheduledTime: null,
    completedAt: null,
    qrVerificationCode: uuidv4().split('-')[0],
    verifiedByNgo: false,
    logisticsProvider: 'FoodLink Network',
    createdAt: new Date().toISOString()
  };

  await updateFoodItem(item.id, {
    isReserved: true,
    reservedByNgoId: pickupRequest.ngoId,
    reservedByNgoName: pickupRequest.ngoName,
    status: 'Requested'
  });

  const pickup = await createPickup(pickupRequest);
  res.status(201).json({ pickup });
}

async function acceptPickup(req, res) {
  const pickupId = req.params.id;
  const pickup = await getPickupById(pickupId);

  if (!pickup) {
    return res.status(404).json({ error: 'Pickup request not found.' });
  }

  if (pickup.ngoId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to accept this pickup.' });
  }

  if (pickup.status !== 'Requested') {
    return res.status(400).json({ error: 'Only requested pickups can be accepted.' });
  }

  const updatedPickup = await updatePickup(pickup.id, {
    status: 'Accepted',
    scheduledTime: new Date().toISOString(),
    estimatedArrivalMinutes: 30
  });

  await updateFoodItem(pickup.foodItemId, {
    status: 'Accepted by NGO'
  });

  res.json({ pickup: updatedPickup });
}

async function getDonationHistory(req, res) {
  const pickups = await getPickupsByNgo(req.user.id);
  res.json({ pickups });
}

module.exports = {
  getNearbyDonations,
  requestFoodDonation,
  acceptPickup,
  getDonationHistory
};
