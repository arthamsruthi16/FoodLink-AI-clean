export type UserRole = 'restaurant' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgName: string;
  orgType: string; // e.g. 'Restaurant', 'Hotel', 'Bakery', 'Food Bank', 'NGO'
  address: string;
  city?: string;
  country?: string;
  region?: string;
  phone: string;
  lat: number;
  lng: number;
  verified: boolean;
  avatarUrl?: string;
  rating?: number;
  totalDonations?: number;
  mealsSaved?: number;
  impactBadge?: string;
  createdAt: string;
}

export type FoodCategory = 'Cooked Meals' | 'Bakery & Bread' | 'Fresh Produce' | 'Dairy & Eggs' | 'Packaged Goods' | 'Beverages';
export type FoodCondition = 'Freshly Prepared' | 'Good' | 'Requires Reheating' | 'Near Expiry';
export type InventoryStatus = 'Safe' | 'Consume Soon' | 'Urgent Pickup' | 'Expired';

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  city?: string;
  country?: string;
  region?: string;
  lat: number;
  lng: number;
  foodName: string;
  category: FoodCategory;
  quantity: number; // in kg or portions
  quantityUnit: 'kg' | 'portions' | 'boxes';
  preparedAt: string;
  expiryTime: string; // ISO string
  pickupWindowStart: string;
  pickupWindowEnd: string;
  foodCondition: FoodCondition;
  imageUrl: string;
  status: InventoryStatus;
  urgencyScore: number; // 0 - 100
  freshnessConfidence: number; // percentage 0-100%
  predictedFreshnessState: 'Safe' | 'Consume Soon' | 'Discard';
  dietaryInfo: string[]; // e.g. ['Vegetarian', 'Nut-Free', 'Halal']
  storageCondition: 'Ambient' | 'Refrigerated' | 'Frozen';
  notes?: string;
  isReserved: boolean;
  reservedByNgoId?: string;
  reservedByNgoName?: string;
  qrCodeData?: string;
  createdAt: string;
}

export type PickupStatus = 'Requested' | 'Scheduled' | 'Courier Assigned' | 'In Transit' | 'Completed' | 'Cancelled';

export interface PickupRequest {
  id: string;
  foodItemId: string;
  foodName: string;
  quantity: number;
  quantityUnit: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLat: number;
  restaurantLng: number;
  ngoId: string;
  ngoName: string;
  ngoAddress: string;
  ngoLat: number;
  ngoLng: number;
  status: PickupStatus;
  trackingNumber: string;
  courierName?: string;
  courierPhone?: string;
  estimatedArrivalMinutes?: number;
  scheduledTime: string;
  completedAt?: string;
  qrVerificationCode: string;
  verifiedByNgo: boolean;
  logisticsProvider: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'donation' | 'pickup' | 'urgency' | 'system' | 'approval';
  read: boolean;
  timestamp: string;
  linkId?: string;
}

export interface Rating {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  foodItemId: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface SystemAnalytics {
  totalDonationsKg: number;
  totalMealsSaved: number;
  co2SavedKg: number;
  waterSavedLiters: number;
  activeRestaurantsCount: number;
  activeNgosCount: number;
  completedPickups: number;
  pendingPickups: number;
  freshnessAccuracyPercentage: number;
  monthlyTrends: { month: string; kgDonated: number; mealsSaved: number }[];
  categoryBreakdown: { category: string; percentage: number }[];
}

export interface NgoRecommendation {
  ngoId: string;
  ngoName: string;
  distanceKm: number;
  matchScore: number; // 0-100
  capacityKg: number;
  estimatedDriveTimeMinutes: number;
  reason: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  ngoName: string;
  location: string;
  date: string;
  timeSlot: string;
  roleType: 'Food Driver' | 'Sorting & Quality Check' | 'Meal Distribution' | 'Community Outreach';
  spotsLeft: number;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  type: 'Restaurant' | 'NGO';
  totalKgSaved: number;
  mealsServed: number;
  badge: string;
  verified: boolean;
}
