import React, { useState } from 'react';
import { FoodMap } from '../components/FoodMap';
import { QRCodeModal } from '../components/QRCodeModal';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { api } from '../services/api';
import { FoodItem, PickupRequest } from '../types';
import { generateDonationReceiptPDF } from '../utils/pdfGenerator';

export const NgoDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { foodItems, reserveFood, verifyPickupQR, notifyAction } = useFood();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [selectedItemForMap, setSelectedItemForMap] = useState<FoodItem | null>(null);
  const [selectedPickupQR, setSelectedPickupQR] = useState<PickupRequest | null>(null);

  const [activeTab, setActiveTab] = useState<'available' | 'reserved' | 'map'>('available');

  // Gemini Recipe Planner State
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipeItems, setSelectedRecipeItems] = useState<string[]>([]);
  const [servingCount, setServingCount] = useState<number>(50);
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const availableItems = foodItems.filter((item) => !item.isReserved);
  const reservedByMe = foodItems.filter((item) => item.reservedByNgoId === currentUser?.id);

  const availableCountries = Array.from(new Set(foodItems.map((i) => i.country).filter(Boolean))) as string[];

  const filteredItems = availableItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All Regions' || item.region === selectedRegion;
    const matchesCountry = selectedCountry === 'All Countries' || item.country === selectedCountry;
    const matchesSearch =
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.country && item.country.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesRegion && matchesCountry && matchesSearch;
  });

  const handleReserve = async (item: FoodItem) => {
    try {
      const pickup = await reserveFood(item.id, {
        ngoId: currentUser?.id,
        ngoName: currentUser?.orgName || 'Hope Community Kitchen',
        ngoAddress: currentUser?.address || '888 Howard St, San Francisco, CA'
      });
      setSelectedPickupQR(pickup);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = async (item: FoodItem) => {
    const mockPickup: PickupRequest = {
      id: `pick_${item.id}`,
      foodItemId: item.id,
      foodName: item.foodName,
      quantity: item.quantity,
      quantityUnit: item.quantityUnit,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      restaurantAddress: item.restaurantAddress,
      restaurantLat: item.lat,
      restaurantLng: item.lng,
      ngoId: currentUser?.id || 'user_ngo_1',
      ngoName: currentUser?.orgName || 'Hope Community Kitchen',
      ngoAddress: currentUser?.address || '888 Howard St, San Francisco, CA',
      ngoLat: currentUser?.lat || 37.7825,
      ngoLng: currentUser?.lng || -122.4042,
      status: 'Completed',
      trackingNumber: `LOG-FLK-${item.id.substring(0, 6)}`,
      scheduledTime: new Date().toISOString(),
      qrVerificationCode: `${item.id}-FLK-VERIFY`,
      verifiedByNgo: true,
      logisticsProvider: 'FoodLink Express Fleet'
    };

    await generateDonationReceiptPDF(item, mockPickup);
  };

  const handleGenerateRecipe = async () => {
    setIsGeneratingRecipe(true);
    setGeneratedRecipe(null);
    try {
      const itemsToUse = selectedRecipeItems.length > 0 
        ? selectedRecipeItems 
        : availableItems.map(i => i.foodName);
      
      const res = await api.generateNgoRecipe(itemsToUse, servingCount);
      setGeneratedRecipe(res.recipeText);
      await notifyAction(
        '👨‍🍳 Zero-Waste Recipe Created!',
        `Gemini AI created a menu plan for ${servingCount} community meals.`,
        'system'
      );
    } catch (err: any) {
      setGeneratedRecipe(`Error generating recipe: ${err.message || 'Gemini AI unavailable'}`);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black">
              {currentUser?.orgName || 'Hope Community Kitchen'} Marketplace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30 text-[11px] font-bold">
              Verified Food Bank ✓
            </span>
          </div>
          <p className="text-xs text-sky-100 mt-1">
            Browse available surplus food, claim donations, and track automated logistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedRecipeItems(availableItems.map(i => i.foodName));
              setShowRecipeModal(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <span>✨ Gemini Recipe Planner</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md text-xs font-bold">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'available' ? 'bg-white text-slate-900 shadow-sm' : 'text-sky-100'
              }`}
            >
              Available ({availableItems.length})
            </button>
            <button
              onClick={() => setActiveTab('reserved')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'reserved' ? 'bg-white text-slate-900 shadow-sm' : 'text-sky-100'
              }`}
            >
              Claimed / Active ({reservedByMe.length})
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-sky-100'
              }`}
            >
              Map View 🗺️
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Available Surplus Food Marketplace */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col space-y-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search by dish, city, country, or donor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedCountry('All Countries');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {['All Regions', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="All Countries">All Countries ({availableCountries.length})</option>
                  {availableCountries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full text-xs font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 text-[11px]">Category:</span>
              {['All', 'Cooked Meals', 'Bakery & Bread', 'Fresh Produce', 'Dairy & Eggs'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.foodName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] shadow-md">
                        {item.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px]">
                        🔥 Urgency {item.urgencyScore}/100
                      </span>
                    </div>

                    {item.country && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-sky-300 font-extrabold text-[10px] border border-sky-500/30">
                        🌐 {item.city ? `${item.city}, ` : ''}{item.country}
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold">
                        {item.quantity} {item.quantityUnit}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.foodName}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      📍 <span className="font-semibold text-slate-700 dark:text-slate-300">{item.restaurantName}</span>
                      <br />
                      <span className="text-[11px] text-slate-400">{item.restaurantAddress}</span>
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        🤖 Freshness: {item.freshnessConfidence}%
                      </span>
                      {item.region && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {item.region}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleReserve(item)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all text-center"
                  >
                    ⚡ Claim & Dispatch Pickup
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItemForMap(item);
                      setActiveTab('map');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                    title="View on Map"
                  >
                    🗺️
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* View 2: Claimed & Active Pickups */}
      {activeTab === 'reserved' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Claimed Surplus Donations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservedByMe.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.foodName}
                    className="w-16 h-16 rounded-2xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                      Claimed Donation
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {item.foodName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {item.restaurantName} • {item.quantity} {item.quantityUnit}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Courier ETA:</span>
                    <span className="font-bold text-emerald-600">~14 Mins En Route</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Logistics Fleet:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">Eco Van #4 (Carlos Ramirez)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDownloadPDF(item)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>📄 Download Tax PDF Receipt</span>
                  </button>
                  <button
                    onClick={() => verifyPickupQR(item.qrCodeData || '8829-FLK-VERIFY')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Verify QR Handover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Map View */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Interactive Community Map View
          </h2>
          <FoodMap foodItems={foodItems} selectedFood={selectedItemForMap} height="500px" />
        </div>
      )}

      {/* Pickup Verification Modal */}
      {selectedPickupQR && (
        <QRCodeModal
          qrCodeData={selectedPickupQR.qrVerificationCode}
          title="Logistics Dispatch Confirmed!"
          subtitle={`Courier ${selectedPickupQR.courierName} assigned. Present code upon handover.`}
          onClose={() => setSelectedPickupQR(null)}
        />
      )}

      {/* Gemini Recipe Planner Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Gemini 3.6 Flash Zero-Waste Recipe Planner
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Auto-generate high-yield community kitchen meal plans using available surplus
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  Select Surplus Ingredients to Include:
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {availableItems.map((item) => {
                    const isChecked = selectedRecipeItems.includes(item.foodName);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedRecipeItems(prev => prev.filter(i => i !== item.foodName));
                          } else {
                            setSelectedRecipeItems(prev => [...prev, item.foodName]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                          isChecked
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '} {item.foodName} ({item.quantity} {item.quantityUnit})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Target Servings Count:
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={servingCount}
                  onChange={(e) => setServingCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleGenerateRecipe}
                disabled={isGeneratingRecipe}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingRecipe ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini 3.6 Flash Crafting Recipe...</span>
                  </>
                ) : (
                  <span>👨‍🍳 Generate Zero-Waste Recipe Plan</span>
                )}
              </button>

              {generatedRecipe && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    <span>✨ Gemini AI Chef Recipe Output</span>
                    <span>Gemini 3.6 Flash</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-xs">
                    {generatedRecipe}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
