import React, { useState } from 'react';
import { useFood } from '../context/FoodContext';

export const AdminDashboard: React.FC = () => {
  const { analytics, foodItems, notifyAction } = useFood();
  const [selectedReport, setSelectedReport] = useState('monthly');

  const [approvalsList, setApprovalsList] = useState([
    { id: 'app_1', name: 'Bay Area Organic Farmers Market', type: 'Grocery Store', email: 'contact@bayorganic.com', date: 'Today' },
    { id: 'app_2', name: 'St. Anthony Food Pantry', type: 'NGO / Shelter', email: 'help@stanthony.org', date: 'Yesterday' }
  ]);

  const handleApprove = async (id: string, name: string) => {
    setApprovalsList((prev) => prev.filter((a) => a.id !== id));
    await notifyAction(
      '✅ Partner Organization Approved!',
      `Admin verified partner: "${name}". Organization granted active network access.`,
      'approval'
    );
  };

  const handleReject = async (id: string, name: string) => {
    setApprovalsList((prev) => prev.filter((a) => a.id !== id));
    await notifyAction(
      '❌ Partner Organization Declined',
      `Verification request for "${name}" was reviewed and declined.`,
      'system'
    );
  };

  const handleExportCSV = async () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Food Name,Category,Quantity,Status,Restaurant,City,Country,Region,Expiry\n' +
      foodItems.map((f) => `${f.id},"${f.foodName}",${f.category},${f.quantity} ${f.quantityUnit},${f.status},"${f.restaurantName}","${f.city || ''}","${f.country || ''}","${f.region || ''}",${f.expiryTime}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FoodLink_AI_Global_Master_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await notifyAction(
      '📥 Master CSV Audit Log Exported',
      `Generated global CSV report with ${foodItems.length} active inventory items.`,
      'system'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">
            FoodLink AI - Global Operations Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System analytics, organization verification, live inventory audit, and CSV reports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <span>📥 Export Master CSV Report</span>
        </button>
      </div>

      {/* Admin KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Active Partners</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            128 Organizations
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">72 Restaurants • 56 NGOs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Pending Verifications</span>
          <div className="text-2xl font-black text-amber-600">
            {approvalsList.length} Pending
          </div>
          <p className="text-[11px] text-slate-500">Requires tax & safety check</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Total Food Saved</span>
          <div className="text-2xl font-black text-emerald-600">
            {analytics?.totalDonationsKg || 1480} kg
          </div>
          <p className="text-[11px] text-slate-500">3,250+ Meals Delivered</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">ML Freshness Score</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            97.4% Accuracy
          </div>
          <p className="text-[11px] text-slate-500">Zero safety incidents reported</p>
        </div>

      </div>

      {/* Main Admin Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Approvals Panel */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pending Partner Verification
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {approvalsList.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center font-medium">
                All pending partner verifications cleared! ✓
              </p>
            ) : (
              approvalsList.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{app.name}</h4>
                    <span className="text-[10px] text-slate-400">{app.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{app.type} • {app.email}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(app.id, app.name)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                    >
                      Approve ✓
                    </button>
                    <button
                      onClick={() => handleReject(app.id, app.name)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics Charts & Category Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Community Food Savings & Monthly Trends
            </h3>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setSelectedReport('monthly')}
                className={`px-3 py-1 rounded-xl font-bold ${
                  selectedReport === 'monthly' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Visual Trend Bars */}
          <div className="space-y-3 pt-2">
            {analytics?.monthlyTrends.map((trend) => (
              <div key={trend.month} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{trend.month} 2026</span>
                  <span className="text-emerald-600">{trend.kgDonated} kg ({trend.mealsSaved} meals)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (trend.kgDonated / 2200) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
              Donation Category Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {analytics?.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-lg font-black text-emerald-600">{cat.percentage}%</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{cat.category}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
