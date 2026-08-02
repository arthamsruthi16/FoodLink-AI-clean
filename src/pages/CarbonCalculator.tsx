import React, { useState } from 'react';
import { useFood } from '../context/FoodContext';
import { calculateEnvironmentalImpact } from '../utils/mlEngine';

export const CarbonCalculator: React.FC = () => {
  const { notifyAction } = useFood();
  const [inputKg, setInputKg] = useState<number>(50);

  const impact = calculateEnvironmentalImpact(inputKg);

  const handleExportCertificate = async () => {
    await notifyAction(
      '📄 ESG Impact Report Exported!',
      `Generated official environmental certificate: ${inputKg} kg saved (${impact.co2SavedKg} kg CO2e offset, ${impact.mealsSaved} meals).`,
      'approval'
    );
  };

  const leaderboard = [
    { rank: 1, name: 'Grand Hyatt Executive Dining', type: 'Hotel Donor', totalKgSaved: 3400, mealsServed: 7480, badge: 'Titan Donor' },
    { rank: 2, name: 'Golden Gate Artisan Bakery', type: 'Bakery', totalKgSaved: 1980, mealsServed: 4356, badge: 'Golden Baker' },
    { rank: 3, name: 'GreenBites Organic Bistro', type: 'Restaurant', totalKgSaved: 1250, mealsServed: 2750, badge: 'Zero Waste Pioneer' },
    { rank: 4, name: 'Bay Area Caterers Guild', type: 'Caterer', totalKgSaved: 920, mealsServed: 2024, badge: 'Community Hero' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Environmental Impact Engine
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Carbon Footprint Calculator & Community Leaderboard
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Quantifying greenhouse gas reduction and embedded water savings for every surplus meal redirected.
        </p>
      </div>

      {/* Interactive Carbon Calculator Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌱 Interactive Food Waste Environmental Calculator</span>
          </h3>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            FLW Standard
          </span>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Select or Enter Surplus Food Weight (kg):
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={inputKg}
              onChange={(e) => setInputKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="w-24 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-emerald-600 text-sm text-center">
              {inputKg} kg
            </div>
          </div>
        </div>

        {/* Calculated Impact Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {impact.mealsSaved} Meals
            </div>
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
              Community Meals Served
            </div>
            <p className="text-[10px] text-slate-500">Based on 450g per serving</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-center space-y-1">
            <div className="text-2xl font-black text-teal-700 dark:text-teal-300">
              {impact.co2SavedKg} kg CO2e
            </div>
            <div className="text-[11px] font-bold text-teal-800 dark:text-teal-400">
              CO2 Emissions Prevented
            </div>
            <p className="text-[10px] text-slate-500">2.5 kg CO2e per kg food saved</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-center space-y-1">
            <div className="text-2xl font-black text-sky-700 dark:text-sky-300">
              {impact.waterSavedLiters.toLocaleString()} L
            </div>
            <div className="text-[11px] font-bold text-sky-800 dark:text-sky-400">
              Embedded Water Saved
            </div>
            <p className="text-[10px] text-slate-500">~950L per kg agricultural water</p>
          </div>

        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={handleExportCertificate}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <span>📜 Export Verified ESG Impact Certificate</span>
          </button>
        </div>
      </div>

      {/* Community Leaderboard */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏆 Top Food Waste Reduction Champions</span>
          </h3>
          <span className="text-xs text-slate-400">Updated Hourly</span>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  entry.rank === 1 ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}>
                  #{entry.rank}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{entry.name}</h4>
                  <p className="text-[11px] text-slate-500">{entry.type} • Badge: <span className="text-emerald-600 font-bold">{entry.badge}</span></p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-sm text-emerald-600">{entry.totalKgSaved} kg Saved</div>
                <div className="text-[11px] text-slate-400">{entry.mealsServed} Meals Served</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
