import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { FoodProvider, useFood } from './context/FoodContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { CarbonCalculator } from './pages/CarbonCalculator';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NgoDashboard } from './pages/NgoDashboard';
import { RegisterPage } from './pages/RegisterPage';
import { RestaurantDashboard } from './pages/RestaurantDashboard';
import { SystemDocsPage } from './pages/SystemDocsPage';
import { VolunteerPage } from './pages/VolunteerPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('foodlink_theme');
    if (saved) return saved === 'dark';
    return false;
  });
  const [showQuickDonateModal, setShowQuickDonateModal] = useState<boolean>(false);
  const [showGeminiAssistantModal, setShowGeminiAssistantModal] = useState<boolean>(false);

  const { addFoodListing } = useFood();

  // Quick Donate Form State
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState(20);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('foodlink_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('foodlink_theme', 'light');
    }
  }, [darkMode]);

  const handleQuickDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addFoodListing({
        restaurantId: 'user_rest_1',
        restaurantName: 'GreenBites Organic Bistro',
        restaurantAddress: '550 Market St, San Francisco, CA',
        lat: 37.7897,
        lng: -122.4012,
        foodName,
        category: 'Cooked Meals',
        quantity: Number(quantity),
        quantityUnit: 'portions',
        foodCondition: 'Freshly Prepared',
        preparedAt: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        notes,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
      });
      setShowQuickDonateModal(false);
      setFoodName('');
      setNotes('');
      setActiveTab('restaurant');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDonateModal={() => setShowQuickDonateModal(true)}
        onOpenGeminiAssistant={() => setShowGeminiAssistantModal(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'landing' && (
              <LandingPage
                onNavigateToRole={(role) => setActiveTab(role)}
                onOpenDonateModal={() => setShowQuickDonateModal(true)}
              />
            )}
            {activeTab === 'login' && (
              <LoginPage
                onNavigateToRegister={() => setActiveTab('register')}
                onNavigateToDashboard={(role) => setActiveTab(role)}
              />
            )}
            {activeTab === 'register' && (
              <RegisterPage
                onNavigateToLogin={() => setActiveTab('login')}
                onNavigateToDashboard={(role) => setActiveTab(role)}
              />
            )}
            {activeTab === 'restaurant' && <RestaurantDashboard />}
            {activeTab === 'ngo' && <NgoDashboard />}
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'carbon' && <CarbonCalculator />}
            {activeTab === 'volunteer' && <VolunteerPage />}
            {activeTab === 'docs' && <SystemDocsPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Quick Donate Modal */}
      {showQuickDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Donate Surplus Food</h3>
              </div>
              <button
                onClick={() => setShowQuickDonateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickDonate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Food Item / Dish</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Organic Lasagna Trays"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Portions / Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Special Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Freshly prepared 1 hour ago, contains dairy."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing Donation...</span>
                  </>
                ) : (
                  <span>🚀 Publish Donation Now</span>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Floating Gemini AI Assistant Quick Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowGeminiAssistantModal(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white font-bold text-xs shadow-2xl hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 border border-emerald-400/40"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-base">✨</span>
          <span className="tracking-wide">Ask Gemini AI</span>
        </button>
      </div>

      {/* Gemini AI Operations Assistant Modal */}
      <GeminiAssistantModal
        isOpen={showGeminiAssistantModal}
        onClose={() => setShowGeminiAssistantModal(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <AppContent />
      </FoodProvider>
    </AuthProvider>
  );
}
