import { Request, Response, Router } from 'express';
import { FoodItem, InventoryStatus } from '../../src/types';
import { calculateUrgencyScore, predictFoodFreshness } from '../../src/utils/mlEngine';
import { db } from '../db';

export const inventoryRouter = Router();

/**
 * Get all inventory items with optional filters
 */
inventoryRouter.get('/', (req: Request, res: Response) => {
  let items = [...db.foodItems];

  const { category, search, status, maxDistance, minUrgency, isReserved } = req.query;

  if (category) {
    items = items.filter((item) => item.category === category);
  }

  if (status) {
    items = items.filter((item) => item.status === status);
  }

  if (isReserved !== undefined) {
    const reservedBool = isReserved === 'true';
    items = items.filter((item) => item.isReserved === reservedBool);
  }

  if (minUrgency) {
    const minVal = Number(minUrgency);
    items = items.filter((item) => item.urgencyScore >= minVal);
  }

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (item) =>
        item.foodName.toLowerCase().includes(q) ||
        item.restaurantName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }

  // Recalculate dynamic statuses & expiry countdowns in real time
  items = items.map((item) => {
    const freshness = predictFoodFreshness(
      item.category,
      item.foodCondition,
      item.storageCondition || 'Refrigerated',
      item.preparedAt,
      item.expiryTime
    );

    return {
      ...item,
      status: freshness.inventoryStatus,
      predictedFreshnessState: freshness.predictedState,
      freshnessConfidence: freshness.confidenceScore
    };
  });

  return res.json({ count: items.length, foodItems: items });
});

/**
 * Add a new Surplus Food Item (Restaurant)
 */
inventoryRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      restaurantId,
      restaurantName,
      restaurantAddress,
      lat,
      lng,
      foodName,
      category,
      quantity,
      quantityUnit,
      preparedAt,
      expiryTime,
      pickupWindowStart,
      pickupWindowEnd,
      foodCondition,
      imageUrl,
      dietaryInfo,
      storageCondition,
      notes
    } = req.body;

    if (!foodName || !category || !quantity || !expiryTime) {
      return res.status(400).json({ error: 'Food name, category, quantity, and expiry time are required.' });
    }

    const prepAt = preparedAt || new Date().toISOString();
    const storeCond = storageCondition || 'Refrigerated';

    // ML Freshness Prediction
    const freshness = predictFoodFreshness(
      category,
      foodCondition || 'Freshly Prepared',
      storeCond,
      prepAt,
      expiryTime
    );

    const hoursLeft = (new Date(expiryTime).getTime() - Date.now()) / (1000 * 60 * 60);

    // Urgency Score calculation
    const urgency = calculateUrgencyScore(
      hoursLeft,
      Number(quantity),
      3.2, // average nearest NGO distance
      category === 'Cooked Meals'
    );

    const newItem: FoodItem = {
      id: `food_${Date.now()}`,
      restaurantId: restaurantId || 'user_rest_1',
      restaurantName: restaurantName || 'GreenBites Organic Bistro',
      restaurantAddress: restaurantAddress || '550 Market St, San Francisco, CA',
      lat: lat || 37.7897,
      lng: lng || -122.4012,
      foodName,
      category,
      quantity: Number(quantity),
      quantityUnit: quantityUnit || 'portions',
      preparedAt: prepAt,
      expiryTime,
      pickupWindowStart: pickupWindowStart || prepAt,
      pickupWindowEnd: pickupWindowEnd || expiryTime,
      foodCondition: foodCondition || 'Freshly Prepared',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      status: freshness.inventoryStatus,
      urgencyScore: urgency,
      freshnessConfidence: freshness.confidenceScore,
      predictedFreshnessState: freshness.predictedState,
      dietaryInfo: dietaryInfo || ['Fresh & Safe'],
      storageCondition: storeCond,
      notes: notes || '',
      isReserved: false,
      qrCodeData: `FLK-QR-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    db.foodItems.unshift(newItem);

    // Notify NGOs about new surplus food
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'user_ngo_1',
      title: '🍲 New Surplus Food Available!',
      message: `${newItem.restaurantName} listed ${newItem.quantity} ${newItem.quantityUnit} of ${newItem.foodName}.`,
      type: 'donation',
      read: false,
      timestamp: new Date().toISOString(),
      linkId: newItem.id
    });

    return res.status(201).json({ foodItem: newItem, freshnessAnalysis: freshness });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add food item.' });
  }
});

/**
 * Reserve a food item (NGO) & create pickup request
 */
inventoryRouter.put('/:id/reserve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { ngoId, ngoName, ngoAddress, ngoLat, ngoLng } = req.body;

  const item = db.foodItems.find((f) => f.id === id);
  if (!item) return res.status(404).json({ error: 'Food item not found.' });

  if (item.isReserved) {
    return res.status(400).json({ error: 'This item has already been reserved by another NGO.' });
  }

  item.isReserved = true;
  item.reservedByNgoId = ngoId || 'user_ngo_1';
  item.reservedByNgoName = ngoName || 'Hope Community Kitchen';

  // Create Pickup Request
  const newPickup = {
    id: `pick_${Date.now()}`,
    foodItemId: item.id,
    foodName: item.foodName,
    quantity: item.quantity,
    quantityUnit: item.quantityUnit,
    restaurantId: item.restaurantId,
    restaurantName: item.restaurantName,
    restaurantAddress: item.restaurantAddress,
    restaurantLat: item.lat,
    restaurantLng: item.lng,
    ngoId: item.reservedByNgoId,
    ngoName: item.reservedByNgoName,
    ngoAddress: ngoAddress || '888 Howard St, San Francisco, CA',
    ngoLat: ngoLat || 37.7825,
    ngoLng: ngoLng || -122.4042,
    status: 'Scheduled' as const,
    trackingNumber: `LOG-FLK-${Math.floor(100000 + Math.random() * 900000)}`,
    courierName: 'Eco Express Courier #7',
    courierPhone: '+1 (415) 555-0899',
    estimatedArrivalMinutes: 18,
    scheduledTime: new Date().toISOString(),
    qrVerificationCode: `${Math.floor(1000 + Math.random() * 9000)}-FLK-VERIFY`,
    verifiedByNgo: false,
    logisticsProvider: 'FoodLink Logistics Network'
  };

  db.pickups.unshift(newPickup);

  // Send Notification to Restaurant
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: item.restaurantId,
    title: '🎉 Reservation Confirmed!',
    message: `${item.reservedByNgoName} has reserved ${item.foodName}. Pickup driver dispatched.`,
    type: 'pickup',
    read: false,
    timestamp: new Date().toISOString(),
    linkId: newPickup.id
  });

  return res.json({ message: 'Reservation successful.', foodItem: item, pickup: newPickup });
});

/**
 * Delete item
 */
inventoryRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.foodItems.findIndex((f) => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found.' });

  db.foodItems.splice(index, 1);
  return res.json({ message: 'Item removed successfully.' });
});
