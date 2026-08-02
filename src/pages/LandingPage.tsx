import { motion } from 'motion/react';
import React, { useState } from 'react';
import { FoodMap } from '../components/FoodMap';
import { useFood } from '../context/FoodContext';

interface LandingPageProps {
  onNavigateToRole: (role: string) => void;
  onOpenDonateModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToRole,
  onOpenDonateModal
}) => {
  const { foodItems, analytics } = useFood();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does FoodLink AI guarantee food safety for donated items?',
      a: 'FoodLink AI utilizes a multi-layered Random Forest ML model and optional Gemini 3.6 Flash vision analysis to evaluate temperature, time elapsed, and packaging integrity. Items nearing unsafe microbial thresholds are automatically flagged for organic composting instead of distribution.'
    },
    {
      q: 'Who can register on the platform?',
      a: 'Restaurants, hotels, bakeries, cafes, caterers, and grocery stores can register as Donors. Registered 501(c)(3) non-profits, homeless shelters, community soup kitchens, and food banks register as NGO Partners.'
    },
    {
      q: 'How is logistics and transport handled?',
      a: 'FoodLink AI features a provider-agnostic logistics service interface that dispatches electric eco-vans or volunteer couriers automatically once an NGO reserves a listing.'
    },
    {
      q: 'Are food donations tax-deductible?',
      a: 'Yes! Every completed pickup generates an official digitally signed PDF Donation Receipt containing QR verification codes eligible for tax deduction under the Food Donation Improvement Act.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Global AI Food Waste Reduction Network 🌐</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Every Meal <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">Matters Worldwide.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Connecting surplus food details from restaurants, hotels, bakeries, and markets across North America, Europe, Asia Pacific, Latin America, and the Middle East with local NGOs in real time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenDonateModal}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>✨ Donate Food Now</span>
                </button>

                <button
                  onClick={() => onNavigateToRole('ngo')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm border border-slate-200 dark:border-slate-800 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>🔍 Find Available Food</span>
                </button>

                <button
                  onClick={() => onNavigateToRole('restaurant')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all flex items-center justify-center gap-2"
                >
                  <span>🤝 Become Partner</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-500 font-bold text-sm">4.9 ★</span>
                  <span>Rated by 120+ Partner Organizations</span>
                </div>
                <span>•</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">100% Tax Deductible</span> Receipts
                </div>
              </div>
            </motion.div>

            {/* Right Hero Graphic Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl relative z-10 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Live Surplus Food Stream</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Auto-Refreshed</span>
                </div>

                {/* Hero Featured Food Items */}
                <div className="space-y-3">
                  {foodItems.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.foodName}
                        className="w-16 h-16 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {item.foodName}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            item.status === 'Safe'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {item.restaurantName} • {item.quantity} {item.quantityUnit}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            🤖 Freshness: {item.freshnessConfidence}%
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">
                            Urgency Score: {item.urgencyScore}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigateToRole('ngo')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors text-center"
                >
                  Explore All Available Surplus Food Listings →
                </button>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. REAL-TIME IMPACT METRICS COUNTER */}
      <section className="py-10 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                {analytics?.totalMealsSaved.toLocaleString() || '3,250'}
              </div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">Meals Saved</div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                {analytics?.totalDonationsKg.toLocaleString() || '1,480'} kg
              </div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">Food Waste Prevented</div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                {analytics?.co2SavedKg.toLocaleString() || '3,700'} kg
              </div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">CO2 Emissions Prevented</div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                97.4%
              </div>
              <div className="text-xs text-emerald-100 font-semibold mt-1">AI Freshness Accuracy</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MAP SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Real-Time Logistics & Map View
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Live Community Food Redistribution Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Interactive map displaying surplus food donors, nearby food banks, and real-time courier pickup routes.
          </p>
        </div>

        <FoodMap foodItems={foodItems} height="440px" />
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How FoodLink AI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Four simple steps connecting food donors with community organizations seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Donor Posts Surplus</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Restaurants or hotels list surplus food items. Gemini AI runs automated freshness audit and estimates safe pickup windows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-black flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. AI Matches NGOs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ML algorithms evaluate nearest food banks based on capacity, travel distance, and dietary demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-black flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. NGO Reserves & Dispatches</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                NGO reserves food with one click. Provider-agnostic logistics dispatches couriers or eco-vans instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">4. QR Verification & Receipt</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Courier verifies delivery with QR code. System generates tax-deductible PDF donation receipts automatically.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Everything you need to know about FoodLink AI operations.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <span className="text-emerald-500">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
