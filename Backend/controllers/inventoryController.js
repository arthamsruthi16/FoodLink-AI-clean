const { v4: uuidv4 } = require('uuid');
const { createFoodItem, getFoodItemById, updateFoodItem, deleteFoodItem, queryFoodItems, getFoodItemsByRestaurant } = require('../models/foodModel');
const { createPickup, updatePickup } = require('../models/pickupModel');
const { recommendNgos, predictFoodFreshness, calculateDistanceKm } = require('../services/aiService');

function resolveStatus(expiryTime) {
  const now = new Date();
  const expiry = new Date(expiryTime);
  if (expiry.getTime() <= now.getTime()) return 'Expired';
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursLeft <= 24 ? 'Expiring Soon' : 'Available';
}

async function getInventory(req, res) {
  const filters = {
    category: req.query.category,
    status: req.query.status,
    search: req.query.search,
    minUrgency: req.query.minUrgency,
    isReserved: req.query.isReserved !== undefined ? req.query.isReserved === 'true' : undefined
  };
  const foodItems = await queryFoodItems(filters);
  res.json({ foodItems });
}

async function createInventoryItem(req, res) {
  const {
    foodName,
    category,
    quantity,
    quantityUnit,
    expiryTime,
    pickupTime,
    address,
    city,
    country,
    region,
    lat,
    lng,
    imageUrl,
    notes
  } = req.body;

  if (!foodName || !category || !quantity || !expiryTime || !pickupTime || !address || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing required donation fields.' });
  }

  const status = resolveStatus(expiryTime);
  const urgencyScore = status === 'Expired' ? 0 : status === 'Expiring Soon' ? 90 : 45;

  const foodItem = {
    id: uuidv4(),
    restaurantId: req.user.id,
    restaurantName: req.user.orgName || req.user.name,
    restaurantAddress: address,
    city: city || req.user.city || '',
    country: country || req.user.country || '',
    region: region || req.user.region || '',
    lat: Number(lat),
    lng: Number(lng),
    foodName,
    category,
    quantity: Number(quantity),
    quantityUnit: quantityUnit || 'kg',
    preparedAt: new Date().toISOString(),
    expiryTime,
    pickupWindowStart: pickupTime,
    pickupWindowEnd: pickupTime,
    foodCondition: 'Good',
    imageUrl: imageUrl || '',
    status,
    urgencyScore,
    freshnessConfidence: status === 'Expired' ? 0 : status === 'Expiring Soon' ? 72 : 94,
    predictedFreshnessState: status === 'Expired' ? 'Discard' : 'Safe',
    dietaryInfo: [],
    storageCondition: 'Ambient',
    notes: notes || '',
    isReserved: false,
    reservedByNgoId: '',
    reservedByNgoName: '',
    qrCodeData: '',
    createdAt: new Date().toISOString()
  };

  const createdItem = await createFoodItem(foodItem);
  res.status(201).json({ foodItem: createdItem });
}

async function reserveInventoryItem(req, res) {
  const itemId = req.params.id;
  const { ngoId, ngoName, ngoLat, ngoLng } = req.body;

  const item = await getFoodItemById(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Food item not found.' });
  }

  if (item.isReserved) {
    return res.status(400).json({ error: 'Food item is already reserved.' });
  }

  const pickupDistance = Number(ngoLat) && Number(ngoLng) ? calculateDistanceKm(item.lat, item.lng, Number(ngoLat), Number(ngoLng)) : 0;
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
    ngoId: ngoId || req.user.id,
    ngoName: ngoName || req.user.orgName || req.user.name,
    ngoAddress: req.user.address || '',
    ngoLat: Number(ngoLat) || Number(req.user.lat || 0),
    ngoLng: Number(ngoLng) || Number(req.user.lng || 0),
    status: 'Scheduled',
    trackingNumber: `TK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    courierName: '',
    courierPhone: '',
    estimatedArrivalMinutes: Math.max(10, Math.round(pickupDistance * 4 + 5)),
    scheduledTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    completedAt: null,
    qrVerificationCode: uuidv4().split('-')[0],
    verifiedByNgo: false,
    logisticsProvider: 'FoodLink Courier Network'
  };

  await updateFoodItem(item.id, {
    isReserved: true,
    reservedByNgoId: pickupRequest.ngoId,
    reservedByNgoName: pickupRequest.ngoName,
    status: 'Urgent Pickup',
    qrCodeData: pickupRequest.qrVerificationCode
  });

  const createdPickup = await createPickup(pickupRequest);
  res.json({ foodItem: await getFoodItemById(item.id), pickup: createdPickup });
}

async function updateInventoryItem(req, res) {
  const itemId = req.params.id;
  const existingItem = await getFoodItemById(itemId);
  if (!existingItem) {
    return res.status(404).json({ error: 'Food item not found.' });
  }

  if (existingItem.restaurantId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this donation.' });
  }

  const updates = {
    foodName: req.body.foodName || existingItem.foodName,
    category: req.body.category || existingItem.category,
    quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : existingItem.quantity,
    quantityUnit: req.body.quantityUnit || existingItem.quantityUnit,
    expiryTime: req.body.expiryTime || existingItem.expiryTime,
    pickupWindowStart: req.body.pickupTime || existingItem.pickupWindowStart,
    pickupWindowEnd: req.body.pickupTime || existingItem.pickupWindowEnd,
    restaurantAddress: req.body.address || existingItem.restaurantAddress,
    city: req.body.city || existingItem.city,
    country: req.body.country || existingItem.country,
    region: req.body.region || existingItem.region,
    lat: req.body.lat !== undefined ? Number(req.body.lat) : existingItem.lat,
    lng: req.body.lng !== undefined ? Number(req.body.lng) : existingItem.lng,
    imageUrl: req.body.imageUrl || existingItem.imageUrl,
    notes: req.body.notes !== undefined ? req.body.notes : existingItem.notes
  };

  updates.status = resolveStatus(updates.expiryTime);
  updates.urgencyScore = updates.status === 'Expired' ? 0 : updates.status === 'Expiring Soon' ? 90 : 45;
  updates.freshnessConfidence = updates.status === 'Expired' ? 0 : updates.status === 'Expiring Soon' ? 72 : 94;
  updates.predictedFreshnessState = updates.status === 'Expired' ? 'Discard' : 'Safe';

  const updatedItem = await updateFoodItem(itemId, updates);
  res.json({ foodItem: updatedItem });
}

async function deleteInventoryItem(req, res) {
  const itemId = req.params.id;
  const item = await getFoodItemById(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Food item not found.' });
  }

  if (item.restaurantId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to delete this donation.' });
  }

  await deleteFoodItem(itemId);
  res.status(204).send();
}

async function getMyDonations(req, res) {
  const restaurantId = req.user.id;
  const foodItems = await getFoodItemsByRestaurant(restaurantId);
  res.json({ foodItems });
}

async function getFoodItem(req, res) {
  const itemId = req.params.id;
  const item = await getFoodItemById(itemId);
  if (!item) {
    return res.status(404).json({ error: 'Food item not found.' });
  }
  res.json({ foodItem: item });
}

module.exports = {
  getInventory,
  getFoodItem,
  getMyDonations,
  createInventoryItem,
  updateInventoryItem,
  reserveInventoryItem,
  deleteInventoryItem
};
