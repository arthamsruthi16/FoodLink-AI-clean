import React, { useState } from 'react';
import { useFood } from '../context/FoodContext';

export const VolunteerPage: React.FC = () => {
  const { notifyAction } = useFood();
  const [signedUpIds, setSignedUpIds] = useState<string[]>([]);

  const ops = [
    {
      id: 'vol_1',
      title: 'Evening Surplus Food Driver',
      ngoName: 'Hope Community Kitchen',
      location: 'Downtown San Francisco Route',
      date: 'Today, July 24',
      timeSlot: '6:00 PM - 8:30 PM',
      roleType: 'Food Driver',
      spotsLeft: 3,
      description: 'Drive insulated electric van to pick up hot meals from partner hotels and deliver to shelter.'
    },
    {
      id: 'vol_2',
      title: 'Bakery & Fresh Produce Sorting Specialist',
      ngoName: 'Bay Area Harvest Network',
      location: '1450 Mission St Warehouse',
      date: 'Tomorrow, July 25',
      timeSlot: '9:00 AM - 12:00 PM',
      roleType: 'Sorting & Quality Check',
      spotsLeft: 5,
      description: 'Inspect sourdough loaves, package artisan pastries, and categorize produce crate deliveries.'
    },
    {
      id: 'vol_3',
      title: 'Community Meal Distribution Captain',
      ngoName: 'St. Vincent Food Bank',
      location: 'SoMa Meal Hall',
      date: 'Saturday, July 26',
      timeSlot: '11:00 AM - 2:00 PM',
      roleType: 'Meal Distribution',
      spotsLeft: 2,
      description: 'Assist in hot meal tray distribution, greeting visitors, and maintaining hygiene standards.'
    }
  ];

  const handleSignUp = async (id: string, title: string) => {
    if (!signedUpIds.includes(id)) {
      setSignedUpIds([...signedUpIds, id]);
      await notifyAction(
        '🙋 Volunteer Shift Claimed!',
        `You signed up for: "${title}". Organizer notified.`,
        'approval'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Community Engagement
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Volunteer Food Rescue Network
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Join eco-van delivery drivers, sorting specialists, and meal hall captains saving surplus food every day.
        </p>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ops.map((op) => {
          const isSignedUp = signedUpIds.includes(op.id);
          return (
            <div
              key={op.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    {op.roleType}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{op.spotsLeft} spots left</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{op.title}</h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  🏛️ {op.ngoName} • {op.location}
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">📅 {op.date}</div>
                  <div className="text-slate-500">⏰ {op.timeSlot}</div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {op.description}
                </p>
              </div>

              <button
                onClick={() => handleSignUp(op.id, op.title)}
                disabled={isSignedUp}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSignedUp
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                {isSignedUp ? '✓ Shift Confirmed!' : 'Sign Up for Volunteer Shift'}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
