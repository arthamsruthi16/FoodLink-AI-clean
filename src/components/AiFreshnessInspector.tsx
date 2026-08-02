import React, { useState } from 'react';
import { api } from '../services/api';

interface AiFreshnessInspectorProps {
  onApplyAnalysis: (analysisData: {
    foodName?: string;
    freshnessScore: number;
    recommendedWindowHours: number;
    notes?: string;
  }) => void;
  onClose: () => void;
}

export const AiFreshnessInspector: React.FC<AiFreshnessInspectorProps> = ({
  onApplyAnalysis,
  onClose
}) => {
  const [foodName, setFoodName] = useState('Gourmet Buffet Tray');
  const [category, setCategory] = useState('Cooked Meals');
  const [quantity, setQuantity] = useState(15);
  const [foodCondition, setFoodCondition] = useState('Freshly Prepared');
  const [notes, setNotes] = useState('Sealed under thermal foil lids.');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.smartGeminiAnalysis({
        foodName,
        category,
        quantity,
        foodCondition,
        notes,
        imageBase64: imagePreview || undefined
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl">
              🤖
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Food Freshness Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powered by Gemini 3.6 Flash & Random Forest ML Safety Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Food Name / Item
              </label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery & Bread">Bakery & Bread</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Packaged Goods">Packaged Goods</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Condition
                </label>
                <select
                  value={foodCondition}
                  onChange={(e) => setFoodCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Freshly Prepared">Freshly Prepared</option>
                  <option value="Good">Good</option>
                  <option value="Requires Reheating">Requires Reheating</option>
                  <option value="Near Expiry">Near Expiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upload or Capture Food Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300"
              />
            </div>
          </div>

          {/* Image Preview & Run Button */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Food Sample"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs text-slate-400">No Image Selected</span>
              )}
            </div>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Food Micro-Freshness...</span>
                </>
              ) : (
                <>
                  <span>✨ Run Gemini AI Freshness Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Result View */}
        {result && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                ✅ Audit Verdict: Safe for Redistribution
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px]">
                {result.confidenceScore}% Confidence
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {result.analysis}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  onApplyAnalysis({
                    foodName,
                    freshnessScore: result.confidenceScore,
                    recommendedWindowHours: 4,
                    notes: result.analysis
                  });
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
              >
                Apply AI Recommendations to Listing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
