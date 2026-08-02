import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDonateModal: () => void;
  onOpenGeminiAssistant?: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonateModal,
  onOpenGeminiAssistant,
  darkMode,
  setDarkMode
}) => {
  const { currentUser, activeRole, switchDemoRole, logout } = useAuth();
  const { notifications, unreadNotifCount, markNotifRead } = useFood();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    switchDemoRole(newRole);
    if (newRole === 'restaurant') setActiveTab('restaurant');
    else if (newRole === 'ngo') setActiveTab('ngo');
    else if (newRole === 'admin') setActiveTab('admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-emerald-100 dark:border-slate-800 transition-colors duration-200">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🍽️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                FoodLink <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Reducing Food Waste • Feeding Communities
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex flex-1 items-center justify-between gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'landing'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('restaurant')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'restaurant'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Restaurant Portal
          </button>
          <button
            onClick={() => setActiveTab('ngo')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'ngo'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            NGO Portal
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Admin Dashboard
          </button>
          <button
            onClick={() => setActiveTab('carbon')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'carbon'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Impact & Badges
          </button>
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'volunteer'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Volunteers
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'docs'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            System Docs
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Demo Role Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <span className="text-emerald-600 dark:text-emerald-400">Role:</span>
            <select
              value={activeRole}
              onChange={handleRoleChange}
              className="bg-transparent font-semibold cursor-pointer focus:outline-none text-emerald-900 dark:text-emerald-100"
            >
              <option value="restaurant" className="text-slate-900">Restaurant (Marco)</option>
              <option value="ngo" className="text-slate-900">NGO (Sarah)</option>
              <option value="admin" className="text-slate-900">Admin (System)</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Notifications"
            >
              🔔
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Real-time Alerts</span>
                    <span className="text-[10px] text-slate-400">{notifications.length} total</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotifRead(n.id)}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                            n.read
                              ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                              : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium border border-emerald-200/50 dark:border-emerald-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Account / Auth Menu */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/80 dark:border-slate-700/80 text-xs"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-900 dark:text-white leading-tight text-[11px] truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                    {currentUser.role}
                  </div>
                </div>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'login'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'register'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-1"
                >
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.orgName}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] capitalize">
                      {currentUser.role} Account
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab(currentUser.role);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span>Go to My Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                  >
                    <span>🔄</span>
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('register');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                  >
                    <span>➕</span>
                    <span>Register New Org</span>
                  </button>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        setActiveTab('login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gemini AI Assistant CTA */}
          {onOpenGeminiAssistant && (
            <button
              onClick={onOpenGeminiAssistant}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm">✨</span>
              <span className="hidden lg:inline">Ask</span>
              <span>Gemini AI</span>
            </button>
          )}

          {/* Primary CTA: Donate Food */}
          <button
            onClick={onOpenDonateModal}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>✨ Donate Surplus Food</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Row */}
      <div className="md:hidden grid grid-cols-3 gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold">
        <button onClick={() => setActiveTab('landing')} className={`px-1 py-1 rounded text-center ${activeTab === 'landing' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Home</button>
        <button onClick={() => setActiveTab('restaurant')} className={`px-1 py-1 rounded text-center ${activeTab === 'restaurant' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Restaurant</button>
        <button onClick={() => setActiveTab('ngo')} className={`px-1 py-1 rounded text-center ${activeTab === 'ngo' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>NGO</button>
        <button onClick={() => setActiveTab('admin')} className={`px-1 py-1 rounded text-center ${activeTab === 'admin' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Admin</button>
        <button onClick={() => setActiveTab('carbon')} className={`px-1 py-1 rounded text-center ${activeTab === 'carbon' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Impact</button>
        <button onClick={() => setActiveTab('docs')} className={`px-1 py-1 rounded text-center ${activeTab === 'docs' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Docs</button>
      </div>
    </header>
  );
};
