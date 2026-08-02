import { FoodCategory, FoodCondition, InventoryStatus, NgoRecommendation, User } from '../types';

/**
 * Calculates Haversine distance between two GPS coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * AI ML Freshness Predictor
 * Simulates a trained Random Forest / Gradient Boosted decision model for perishable food safety.
 */
export interface FreshnessPredictionResult {
  predictedState: 'Safe' | 'Consume Soon' | 'Discard';
  confidenceScore: number; // 0-100%
  inventoryStatus: InventoryStatus;
  hoursRemaining: number;
  recommendation: string;
  shelfLifeMaxHours: number;
}

export function predictFoodFreshness(
  category: FoodCategory,
  foodCondition: FoodCondition,
  storageCondition: 'Ambient' | 'Refrigerated' | 'Frozen',
  preparedAtISO: string,
  expiryTimeISO: string
): FreshnessPredictionResult {
  const now = new Date();
  const prep = new Date(preparedAtISO);
  const exp = new Date(expiryTimeISO);

  const hoursSincePrep = Math.max(0, (now.getTime() - prep.getTime()) / (1000 * 60 * 60));
  const hoursToExpiry = (exp.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Maximum standard shelf-life baseline by category (hours)
  let baseShelfLife = 8;
  switch (category) {
    case 'Cooked Meals':
      baseShelfLife = storageCondition === 'Refrigerated' ? 24 : 6;
      break;
    case 'Bakery & Bread':
      baseShelfLife = 36;
      break;
    case 'Fresh Produce':
      baseShelfLife = 48;
      break;
    case 'Dairy & Eggs':
      baseShelfLife = storageCondition === 'Refrigerated' ? 48 : 8;
      break;
    case 'Packaged Goods':
      baseShelfLife = 72;
      break;
    case 'Beverages':
      baseShelfLife = 24;
      break;
  }

  if (storageCondition === 'Frozen') baseShelfLife *= 3;

  // Condition multiplier
  let conditionFactor = 1.0;
  if (foodCondition === 'Freshly Prepared') conditionFactor = 1.1;
  if (foodCondition === 'Good') conditionFactor = 0.95;
  if (foodCondition === 'Requires Reheating') conditionFactor = 0.8;
  if (foodCondition === 'Near Expiry') conditionFactor = 0.5;

  const adjustedShelfLife = baseShelfLife * conditionFactor;

  let state: 'Safe' | 'Consume Soon' | 'Discard' = 'Safe';
  let invStatus: InventoryStatus = 'Safe';
  let confidence = 94.2;

  if (hoursToExpiry <= 0) {
    state = 'Discard';
    invStatus = 'Expired';
    confidence = 98.8;
  } else if (hoursToExpiry <= 2 || hoursSincePrep > adjustedShelfLife * 0.8) {
    state = 'Consume Soon';
    invStatus = 'Urgent Pickup';
    confidence = 92.4;
  } else if (hoursToExpiry <= 5) {
    state = 'Consume Soon';
    invStatus = 'Consume Soon';
    confidence = 95.1;
  } else {
    state = 'Safe';
    invStatus = 'Safe';
    confidence = 97.6;
  }

  let rec = 'Optimal condition for redistribution. Safe for immediate consumption.';
  if (state === 'Consume Soon') {
    rec = 'Item nearing expiry. Prioritize immediate NGO pickup or cold storage transfer.';
  } else if (state === 'Discard') {
    rec = 'Food has exceeded safe microbial window. Divert to organic composting.';
  }

  return {
    predictedState: state,
    confidenceScore: Math.round(confidence * 10) / 10,
    inventoryStatus: invStatus,
    hoursRemaining: Math.max(0, Math.round(hoursToExpiry * 10) / 10),
    recommendation: rec,
    shelfLifeMaxHours: Math.round(adjustedShelfLife)
  };
}

/**
 * AI Pickup Urgency Score Engine
 * Computes an urgency score (0 - 100) combining Expiry (40%), Quantity (25%), Demand (20%), and Distance (15%).
 */
export function calculateUrgencyScore(
  hoursUntilExpiry: number,
  quantityKg: number,
  nearestNgoDistanceKm: number,
  isCookedMeal: boolean
): number {
  if (hoursUntilExpiry <= 0) return 0; // Expired

  // 1. Expiry Score (0-100): <2h = 100, 2-5h = 80, 5-10h = 50, >10h = 20
  let expiryScore = 20;
  if (hoursUntilExpiry <= 2) expiryScore = 100;
  else if (hoursUntilExpiry <= 4) expiryScore = 85;
  else if (hoursUntilExpiry <= 8) expiryScore = 60;
  else if (hoursUntilExpiry <= 12) expiryScore = 40;

  // 2. Quantity Score (0-100): Larger bulk = higher urgency to save
  const quantityScore = Math.min(100, (quantityKg / 50) * 100);

  // 3. Demand Score: Cooked meals have higher urgency
  const demandScore = isCookedMeal ? 90 : 65;

  // 4. Distance Score: Farther distance needs earlier dispatch
  const distanceScore = Math.min(100, (nearestNgoDistanceKm / 15) * 100);

  const totalUrgency =
    expiryScore * 0.4 + quantityScore * 0.25 + demandScore * 0.2 + distanceScore * 0.15;

  return Math.min(99, Math.max(10, Math.round(totalUrgency)));
}

/**
 * AI NGO Matchmaker & Recommendation Engine
 * Ranks available NGOs based on proximity, capacity, and match probability.
 */
export function recommendNgos(
  restLat: number,
  restLng: number,
  foodQuantityKg: number,
  ngos: User[]
): NgoRecommendation[] {
  return ngos
    .filter((u) => u.role === 'ngo')
    .map((ngo) => {
      const dist = calculateDistanceKm(restLat, restLng, ngo.lat, ngo.lng);
      const estimatedDriveTime = Math.max(5, Math.round(dist * 2.5 + 3));

      // Capacity estimation simulation based on NGO size/type
      const capacityKg = 150;
      const distScore = Math.max(0, 100 - dist * 8);
      const capScore = foodQuantityKg <= capacityKg ? 100 : 60;

      const matchScore = Math.round(distScore * 0.6 + capScore * 0.4);

      let reason = `Located ${dist} km away with fast ${estimatedDriveTime}-min pickup window.`;
      if (dist < 3) {
        reason = `Ultra-close proximity (${dist} km). High historical response rate.`;
      } else if (matchScore > 85) {
        reason = `Optimal capacity match with excellent logistics route efficiency.`;
      }

      return {
        ngoId: ngo.id,
        ngoName: ngo.orgName || ngo.name,
        distanceKm: dist,
        matchScore: Math.min(98, Math.max(50, matchScore)),
        capacityKg,
        estimatedDriveTimeMinutes: estimatedDriveTime,
        reason
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Environmental Impact Calculator
 * Standard Food Loss & Waste protocol multipliers
 */
export function calculateEnvironmentalImpact(quantityKg: number) {
  const mealsSaved = Math.round(quantityKg * 2.2); // ~450g per meal
  const co2SavedKg = Math.round(quantityKg * 2.5 * 10) / 10; // 2.5kg CO2e per kg food saved
  const waterSavedLiters = Math.round(quantityKg * 950); // ~950L embedded water per kg

  return {
    mealsSaved,
    co2SavedKg,
    waterSavedLiters
  };
}
