import { motion } from 'motion/react';
import React, { useState } from 'react';
import { AiFreshnessInspector } from '../components/AiFreshnessInspector';
import { QRCodeModal } from '../components/QRCodeModal';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { FoodCategory, FoodCondition, FoodItem } from '../types';

export const RestaurantDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { foodItems, pickups, addFoodListing } = useFood();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiInspector, setShowAiInspector] = useState(false);
  const [selectedQrItem, setSelectedQrItem] = useState<FoodItem | null>(null);

  // Add Item Form State
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantity, setQuantity] = useState(10);
  const [quantityUnit, setQuantityUnit] = useState<'kg' | 'portions' | 'boxes'>('portions');
  const [foodCondition, setFoodCondition] = useState<FoodCondition>('Freshly Prepared');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState('North America');
  const [expiryHours, setExpiryHours] = useState(4);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const myItems = foodItems.filter(
    (item) => item.restaurantId === currentUser?.id || item.restaurantName.includes('GreenBites')
  );

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const expiryTime = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();
      await addFoodListing({
        restaurantId: currentUser?.id || 'user_rest_1',
        restaurantName: currentUser?.orgName || 'GreenBites Organic Bistro',
        restaurantAddress: currentUser?.address || `${city}, ${country}`,
        city,
        country,
        region,
        lat: currentUser?.lat || 37.7897,
        lng: currentUser?.lng || -122.4012,
        foodName,
        category,
        quantity: Number(quantity),
        quantityUnit,
        foodCondition,
        preparedAt: new Date().toISOString(),
        expiryTime,
        imageUrl,
        notes
      });

      setShowAddModal(false);
      setFoodName('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black">
              {currentUser?.orgName || 'GreenBites Bistro'} Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold">
              Verified Donor ✓
            </span>
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Manage surplus food listings, monitor AI freshness, and track courier pickups.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2"
        >
          <span>➕ Post New Surplus Food</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Active Items</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {myItems.filter((i) => !i.isReserved).length} Listed
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Ready for NGO pickup</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Reserved / Pickup En Route</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {myItems.filter((i) => i.isReserved).length} Reserved
          </div>
          <p className="text-[11px] text-slate-500">Eco courier dispatched</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Meals Saved</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currentUser?.mealsSaved || 1250} Meals
          </div>
          <p className="text-[11px] text-slate-500">~2.2 meals per kg</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Donor Badge</span>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏆</span>
            <span>{currentUser?.impactBadge || 'Zero Waste Pioneer'}</span>
          </div>
          <p className="text-[11px] text-slate-500">Top 5% Donor Rank</p>
        </div>

      </div>

      {/* Live Inventory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Surplus Inventory
          </h2>
          <button
            onClick={() => setShowAiInspector(true)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            🤖 Run Gemini Freshness Inspector
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
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
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold shadow-md ${
                      item.status === 'Safe'
                        ? 'bg-emerald-500 text-white'
                        : item.status === 'Consume Soon'
                        ? 'bg-amber-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.quantity} {item.quantityUnit}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.foodName}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {item.notes || 'No special handling instructions specified.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">🤖 AI Freshness Confidence:</span>
                    <span className="font-bold text-emerald-600">{item.freshnessConfidence}%</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedQrItem(item)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>📱 View Pickup QR Code</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Surplus Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Post Surplus Food Listing</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Fresh Gourmet Salad Bowls"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Tokyo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Japan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Middle East & Africa">Middle East & Africa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery & Bread">Bakery & Bread</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Packaged Goods">Packaged Goods</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Quantity</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                    <select
                      value={quantityUnit}
                      onChange={(e) => setQuantityUnit(e.target.value as any)}
                      className="flex-1 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <option value="portions">portions</option>
                      <option value="kg">kg</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Condition</label>
                  <select
                    value={foodCondition}
                    onChange={(e) => setFoodCondition(e.target.value as FoodCondition)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Freshly Prepared">Freshly Prepared</option>
                    <option value="Good">Good</option>
                    <option value="Requires Reheating">Requires Reheating</option>
                    <option value="Near Expiry">Near Expiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Safe Expiry Window</label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value={2}>2 Hours (Urgent)</option>
                    <option value={4}>4 Hours (Standard)</option>
                    <option value={8}>8 Hours</option>
                    <option value={24}>24 Hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Special Packaging & Handling Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Thermal foil wrapped, allergens labeled."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
              >
                {isSubmitting ? 'Publishing Listing...' : 'Publish Surplus Food Listing'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* AI Inspector Modal */}
      {showAiInspector && (
        <AiFreshnessInspector
          onClose={() => setShowAiInspector(false)}
          onApplyAnalysis={(analysis) => {
            if (analysis.foodName) setFoodName(analysis.foodName);
            if (analysis.notes) setNotes(analysis.notes);
            setShowAddModal(true);
          }}
        />
      )}

      {/* QR Code Handover Modal */}
      {selectedQrItem && (
        <QRCodeModal
          qrCodeData={selectedQrItem.qrCodeData || `FLK-QR-${selectedQrItem.id}`}
          title={`Pickup Verification QR Code`}
          subtitle={`Present this QR code to the NGO driver upon pickup handover for ${selectedQrItem.foodName}.`}
          onClose={() => setSelectedQrItem(null)}
        />
      )}

    </div>
  );
};
