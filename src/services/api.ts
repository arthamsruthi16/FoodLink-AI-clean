import { FoodItem, NgoRecommendation, Notification, PickupRequest, SystemAnalytics, User } from '../types';
import { apiClient } from './axios';

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },

  async register(userData: Partial<User> & { password: string }) {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/register', userData);
    return res.data;
  },

  async getMe(): Promise<{ user: User } | null> {
    try {
      const res = await apiClient.get<{ user: User }>('/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },

  // Inventory
  async getInventory(filters?: { category?: string; status?: string; search?: string; minUrgency?: number; isReserved?: boolean }): Promise<{ foodItems: FoodItem[] }> {
    const query = new URLSearchParams();
    if (filters?.category) query.append('category', filters.category);
    if (filters?.status) query.append('status', filters.status);
    if (filters?.search) query.append('search', filters.search);
    if (filters?.minUrgency) query.append('minUrgency', String(filters.minUrgency));
    if (filters?.isReserved !== undefined) query.append('isReserved', String(filters.isReserved));

    const res = await apiClient.get<{ foodItems: FoodItem[] }>(`/inventory?${query.toString()}`);
    return res.data;
  },

  async addFoodItem(itemData: Partial<FoodItem>): Promise<{ foodItem: FoodItem; freshnessAnalysis: any }> {
    const res = await apiClient.post<{ foodItem: FoodItem; freshnessAnalysis: any }>('/inventory', itemData);
    return res.data;
  },

  async reserveFoodItem(id: string, ngoData?: any): Promise<{ foodItem: FoodItem; pickup: PickupRequest }> {
    const res = await apiClient.put<{ foodItem: FoodItem; pickup: PickupRequest }>(`/inventory/${id}/reserve`, ngoData || {});
    return res.data;
  },

  // AI & ML
  async predictFreshness(payload: { category: string; foodCondition: string; storageCondition: string; preparedAt: string; expiryTime: string }) {
    const res = await apiClient.post('/ai/predict-freshness', payload);
    return res.data;
  },

  async recommendNgos(lat: number, lng: number, quantityKg: number): Promise<{ recommendations: NgoRecommendation[] }> {
    const res = await apiClient.post<{ recommendations: NgoRecommendation[] }>('/ai/recommend-ngos', { lat, lng, quantityKg });
    return res.data;
  },

  async smartGeminiAnalysis(payload: { foodName: string; category: string; quantity: number; foodCondition: string; notes?: string; imageBase64?: string }) {
    const res = await apiClient.post<any>('/ai/smart-analysis', payload);
    return res.data;
  },

  async getAnalytics(): Promise<{ analytics: SystemAnalytics }> {
    const res = await apiClient.get<{ analytics: SystemAnalytics }>('/ai/insights');
    return res.data;
  },

  async askGeminiAssistant(message: string, contextRole?: string): Promise<{ reply: string; source: string }> {
    const res = await apiClient.post<{ reply: string; source: string }>('/ai/assistant-chat', { message, contextRole });
    return res.data;
  },

  async generateNgoRecipe(items: string[], servingCount?: number): Promise<{ recipeText: string; source: string }> {
    const res = await apiClient.post<{ recipeText: string; source: string }>('/ai/recipe-generator', { items, servingCount });
    return res.data;
  },

  // Logistics
  async dispatchLogistics(pickupId: string) {
    const res = await apiClient.post<any>('/logistics/dispatch', { pickupId });
    return res.data;
  },

  async trackShipment(trackingNumber: string) {
    const res = await apiClient.get<any>(`/logistics/track/${trackingNumber}`);
    return res.data;
  },

  async verifyQRCode(qrCode: string) {
    const res = await apiClient.post<{ verified: boolean; pickup?: PickupRequest }>('/logistics/verify-qr', { qrCode });
    return res.data;
  },

  // Notifications
  async getNotifications(userId?: string): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const res = await apiClient.get<{ notifications: Notification[]; unreadCount: number }>(`/notifications${userId ? `?userId=${userId}` : ''}`);
    return res.data;
  },

  async createNotification(notif: { title: string; message: string; type?: string; linkId?: string; userId?: string }): Promise<{ notification: Notification }> {
    const res = await apiClient.post<{ notification: Notification }>('/notifications', notif);
    return res.data;
  },

  async markNotificationRead(id: string) {
    await apiClient.put(`/notifications/${id}/read`);
  }
};
