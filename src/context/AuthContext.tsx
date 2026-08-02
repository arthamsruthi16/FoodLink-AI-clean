import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  activeRole: UserRole;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('foodlink_token'));
  const [activeRole, setActiveRole] = useState<UserRole>('restaurant');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res && 'user' in res && res.user) {
            setCurrentUser(res.user);
            setActiveRole(res.user.role);
          } else {
            // Default demo user fallback
            setDemoUser('restaurant');
          }
        } catch {
          setDemoUser('restaurant');
        }
      } else {
        setDemoUser('restaurant');
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const setDemoUser = (role: UserRole) => {
    if (role === 'restaurant') {
      setCurrentUser({
        id: 'user_rest_1',
        name: 'Chef Marco Rossi',
        email: 'marco@greenbites.com',
        role: 'restaurant',
        orgName: 'GreenBites Organic Bistro',
        orgType: 'Restaurant',
        address: '550 Market St, San Francisco, CA',
        phone: '+1 (415) 890-1234',
        lat: 37.7897,
        lng: -122.4012,
        verified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        totalDonations: 42,
        mealsSaved: 1250,
        impactBadge: 'Zero Waste Pioneer',
        createdAt: '2026-01-15T08:00:00Z'
      });
      setActiveRole('restaurant');
    } else if (role === 'ngo') {
      setCurrentUser({
        id: 'user_ngo_1',
        name: 'Sarah Jenkins',
        email: 'sarah@hopekitchen.org',
        role: 'ngo',
        orgName: 'Hope Community Kitchen',
        orgType: 'Food Bank',
        address: '888 Howard St, San Francisco, CA',
        phone: '+1 (415) 555-0199',
        lat: 37.7825,
        lng: -122.4042,
        verified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        totalDonations: 120,
        mealsSaved: 4800,
        impactBadge: 'Master Distributor',
        createdAt: '2026-01-10T08:00:00Z'
      });
      setActiveRole('ngo');
    } else {
      setCurrentUser({
        id: 'user_admin_1',
        name: 'Admin Operations',
        email: 'admin@foodlink.ai',
        role: 'admin',
        orgName: 'FoodLink Operations HQ',
        orgType: 'Admin Headquarters',
        address: '100 Pine St, San Francisco, CA',
        phone: '+1 (415) 500-9000',
        lat: 37.7925,
        lng: -122.3995,
        verified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        createdAt: '2026-01-01T08:00:00Z'
      });
      setActiveRole('admin');
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('foodlink_token', res.token);
    setToken(res.token);
    setCurrentUser(res.user);
    setActiveRole(res.user.role);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    localStorage.setItem('foodlink_token', res.token);
    setToken(res.token);
    setCurrentUser(res.user);
    setActiveRole(res.user.role);
  };

  const logout = () => {
    localStorage.removeItem('foodlink_token');
    setToken(null);
    setCurrentUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    setDemoUser(role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        activeRole,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
