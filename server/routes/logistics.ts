import { Request, Response, Router } from 'express';
import { PickupStatus } from '../../src/types';
import { db } from '../db';

export const logisticsRouter = Router();

const LOGISTICS_API_KEY = process.env.LOGISTICS_PROVIDER_API_KEY || '';

/**
 * Provider-Agnostic Logistics Service Abstraction
 */
export class LogisticsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async dispatchCourier(pickupId: string) {
    const pickup = db.pickups.find((p) => p.id === pickupId);
    if (!pickup) throw new Error('Pickup request not found.');

    // Simulated API handshake with logistics provider
    pickup.status = 'In Transit';
    pickup.courierName = 'Carlos Ramirez (Eco Van #4)';
    pickup.courierPhone = '+1 (415) 992-8811';
    pickup.estimatedArrivalMinutes = 14;

    return {
      success: true,
      provider: 'FoodLink Provider-Agnostic Logistics API',
      trackingNumber: pickup.trackingNumber,
      courierName: pickup.courierName,
      etaMinutes: pickup.estimatedArrivalMinutes,
      status: pickup.status
    };
  }

  public async getLiveTracking(trackingNumber: string) {
    const pickup = db.pickups.find((p) => p.trackingNumber === trackingNumber);
    if (!pickup) throw new Error('Tracking number not found.');

    return {
      trackingNumber,
      status: pickup.status,
      restaurantLocation: { lat: pickup.restaurantLat, lng: pickup.restaurantLng, name: pickup.restaurantName },
      ngoLocation: { lat: pickup.ngoLat, lng: pickup.ngoLng, name: pickup.ngoName },
      courier: { name: pickup.courierName, phone: pickup.courierPhone },
      etaMinutes: pickup.estimatedArrivalMinutes || 10,
      lastUpdated: new Date().toISOString()
    };
  }
}

const logisticsService = new LogisticsService(LOGISTICS_API_KEY);

/**
 * Dispatch Courier Endpoint
 */
logisticsRouter.post('/dispatch', async (req: Request, res: Response) => {
  try {
    const { pickupId } = req.body;
    if (!pickupId) return res.status(400).json({ error: 'pickupId is required.' });

    const result = await logisticsService.dispatchCourier(pickupId);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Live Tracking Endpoint
 */
logisticsRouter.get('/track/:trackingNumber', async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.params;
    const result = await logisticsService.getLiveTracking(trackingNumber);
    return res.json(result);
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
});

/**
 * Webhook Handler for external logistics updates
 */
logisticsRouter.post('/webhook', (req: Request, res: Response) => {
  const { trackingNumber, newStatus, courierLocation } = req.body;

  const pickup = db.pickups.find((p) => p.trackingNumber === trackingNumber);
  if (!pickup) return res.status(404).json({ error: 'Pickup tracking ref not found.' });

  if (newStatus) {
    pickup.status = newStatus as PickupStatus;
  }

  if (newStatus === 'Completed') {
    pickup.completedAt = new Date().toISOString();

    // Mark food item as completed
    const foodItem = db.foodItems.find((f) => f.id === pickup.foodItemId);
    if (foodItem) {
      foodItem.status = 'Expired'; // Completed & removed from active list
    }
  }

  return res.json({ received: true, trackingNumber, updatedStatus: pickup.status });
});

/**
 * QR Code Verification on Pickup Handover
 */
logisticsRouter.post('/verify-qr', (req: Request, res: Response) => {
  const { qrCode } = req.body;

  const pickup = db.pickups.find((p) => p.qrVerificationCode === qrCode || p.trackingNumber === qrCode);

  if (!pickup) {
    return res.status(400).json({ verified: false, error: 'Invalid QR verification code.' });
  }

  pickup.verifiedByNgo = true;
  pickup.status = 'Completed';
  pickup.completedAt = new Date().toISOString();

  // Notify Restaurant
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: pickup.restaurantId,
    title: '✅ Pickup Completed & Verified!',
    message: `${pickup.ngoName} verified delivery of ${pickup.quantity} ${pickup.quantityUnit} ${pickup.foodName}.`,
    type: 'pickup',
    read: false,
    timestamp: new Date().toISOString(),
    linkId: pickup.id
  });

  return res.json({
    verified: true,
    message: 'Pickup handover successfully verified!',
    pickup
  });
});
