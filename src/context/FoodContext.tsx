import React, { createContext, useContext, useEffect, useState } from 'react';
import { NotificationToast } from '../components/NotificationToast';
import { api } from '../services/api';
import { FoodItem, Notification, PickupRequest, SystemAnalytics } from '../types';

interface ToastItem extends Notification {
  toastId: string;
}

interface FoodContextType {
  foodItems: FoodItem[];
  pickups: PickupRequest[];
  notifications: Notification[];
  analytics: SystemAnalytics | null;
  unreadNotifCount: number;
  isLoadingInventory: boolean;
  refreshInventory: (filters?: any) => Promise<void>;
  addFoodListing: (data: Partial<FoodItem>) => Promise<FoodItem>;
  reserveFood: (foodId: string, ngoData?: any) => Promise<PickupRequest>;
  markNotifRead: (id: string) => Promise<void>;
  verifyPickupQR: (qrCode: string) => Promise<boolean>;
  notifyAction: (title: string, message: string, type?: Notification['type'], linkId?: string) => Promise<void>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (notif: Notification) => {
    const toastId = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastItem = { ...notif, toastId };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 5500);
  };

  const notifyAction = async (title: string, message: string, type: Notification['type'] = 'system', linkId?: string) => {
    try {
      const res = await api.createNotification({ title, message, type, linkId, userId: 'all' });
      if (res?.notification) {
        setNotifications((prev) => [res.notification, ...prev]);
        setUnreadNotifCount((prev) => prev + 1);
        showToast(res.notification);
      }
    } catch (err) {
      console.error('Failed to dispatch notification:', err);
      const localNotif: Notification = {
        id: `notif_local_${Date.now()}`,
        userId: 'all',
        title,
        message,
        type,
        read: false,
        timestamp: new Date().toISOString(),
        linkId
      };
      setNotifications((prev) => [localNotif, ...prev]);
      setUnreadNotifCount((prev) => prev + 1);
      showToast(localNotif);
    }
  };

  const fetchAllData = async () => {
    try {
      setIsLoadingInventory(true);
      const [invRes, notifRes, analyticsRes] = await Promise.all([
        api.getInventory(),
        api.getNotifications(),
        api.getAnalytics()
      ]);

      if (invRes?.foodItems) setFoodItems(invRes.foodItems);
      if (notifRes?.notifications) {
        setNotifications(notifRes.notifications);
        setUnreadNotifCount(notifRes.unreadCount || 0);
      }
      if (analyticsRes?.analytics) setAnalytics(analyticsRes.analytics);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Auto refresh every 15 seconds for real-time live inventory & notifications
    const interval = setInterval(() => {
      api.getInventory().then((res) => {
        if (res?.foodItems) setFoodItems(res.foodItems);
      });
      api.getNotifications().then((res) => {
        if (res?.notifications) {
          setNotifications(res.notifications);
          setUnreadNotifCount(res.unreadCount || 0);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const refreshInventory = async (filters?: any) => {
    const res = await api.getInventory(filters);
    if (res?.foodItems) setFoodItems(res.foodItems);
  };

  const addFoodListing = async (data: Partial<FoodItem>) => {
    const res = await api.addFoodItem(data);
    await fetchAllData();
    await notifyAction(
      '🍲 Surplus Food Listed!',
      `${data.restaurantName || 'Donor'} listed ${data.quantity} ${data.quantityUnit || 'portions'} of ${data.foodName}.`,
      'donation',
      res.foodItem?.id
    );
    return res.foodItem;
  };

  const reserveFood = async (foodId: string, ngoData?: any) => {
    const res = await api.reserveFoodItem(foodId, ngoData);
    await fetchAllData();
    await notifyAction(
      '🎉 Food Claimed & Reserved!',
      `${ngoData?.ngoName || 'NGO'} reserved ${res.pickup?.foodName || 'surplus food'}. Courier assigned!`,
      'pickup',
      res.pickup?.id
    );
    return res.pickup;
  };

  const markNotifRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadNotifCount((prev) => Math.max(0, prev - 1));
  };

  const verifyPickupQR = async (qrCode: string): Promise<boolean> => {
    const res = await api.verifyQRCode(qrCode);
    if (res?.verified) {
      await fetchAllData();
      await notifyAction(
        '✅ Handover Completed & Verified!',
        `Food handover for ${res.pickup?.foodName || 'item'} was successfully verified.`,
        'approval',
        res.pickup?.id
      );
      return true;
    }
    return false;
  };

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        pickups,
        notifications,
        analytics,
        unreadNotifCount,
        isLoadingInventory,
        refreshInventory,
        addFoodListing,
        reserveFood,
        markNotifRead,
        verifyPickupQR,
        notifyAction
      }}
    >
      <NotificationToast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.toastId !== id))}
      />
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) throw new Error('useFood must be used within FoodProvider');
  return context;
};
