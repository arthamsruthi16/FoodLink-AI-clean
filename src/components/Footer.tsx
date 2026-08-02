import React from 'react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">
                🍽️
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                FoodLink <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reducing Food Waste, Feeding Communities. Connecting restaurants, hotels, cafes, and bakeries with NGOs and food banks using AI freshness predictions and automated logistics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>🌱 1,480+ kg Food Saved</span>
              <span>•</span>
              <span>💚 3,250+ Meals Served</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Platform Modules</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('restaurant')} className="hover:text-emerald-400 transition-colors">
                  Restaurant & Donor Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ngo')} className="hover:text-emerald-400 transition-colors">
                  NGO & Food Bank Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-400 transition-colors">
                  Admin Analytics & Approvals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('carbon')} className="hover:text-emerald-400 transition-colors">
                  Carbon Footprint & Badges
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('volunteer')} className="hover:text-emerald-400 transition-colors">
                  Volunteer Dispatch Engine
                </button>
              </li>
            </ul>
          </div>

          {/* AI & ML Technology */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">AI & ML Architecture</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>🤖 Gemini 3.6 Flash LLM Inspection</li>
              <li>📊 Random Forest Freshness Predictor</li>
              <li>📍 Haversine NGO Matchmaker ML</li>
              <li>🚚 Provider-Agnostic Logistics API</li>
              <li>⚡ Real-time Countdown Tickers</li>
              <li>📱 QR Code Handover Verification</li>
            </ul>
          </div>

          {/* Developer & Documentation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Developer & System Docs</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 mb-4">
              <li>
                <button onClick={() => setActiveTab('docs')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>📄 ER Diagram & DDL Schema</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('docs')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>⚡ REST API & Webhooks Spec</span>
                </button>
              </li>
            </ul>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400 block mb-1">🔐 Security Protocol</span>
              API Keys managed securely via environment variables (<code className="text-emerald-300">.env</code>). Never exposed client-side.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FoodLink AI. All rights reserved. Reducing Food Waste, Feeding Communities.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
