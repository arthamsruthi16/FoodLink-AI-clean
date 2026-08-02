import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { UserRole } from '../types';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onNavigateToDashboard: (role: UserRole) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  onNavigateToDashboard
}) => {
  const { register } = useAuth();
  const { notifyAction } = useFood();

  const [role, setRole] = useState<UserRole>('restaurant');
  const [step, setStep] = useState<number>(1);

  // Step 1: Organization & Role
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Restaurant');
  const [address, setAddress] = useState('550 Market St, San Francisco, CA');
  const [phone, setPhone] = useState('+1 (415) 555-0142');

  // Step 2: Contact Person Credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 3: Safety & Terms
  const [agreedToSafety, setAgreedToSafety] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const orgTypesByRole: Record<UserRole, string[]> = {
    restaurant: ['Restaurant', 'Hotel & Resort', 'Bakery & Pastry', 'Supermarket & Grocery', 'Cafe & Catering', 'Corporate Cafeteria'],
    ngo: ['Food Bank', 'Homeless Shelter', 'Community Kitchen', 'Charity Foundation', 'Disaster Relief Group'],
    admin: ['Platform Operations', 'City Municipality', 'Logistics Fleet Partner']
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!orgName) {
        setErrorMessage('Please enter your organization name.');
        return;
      }
      setErrorMessage(null);
      setStep(2);
    } else if (step === 2) {
      if (!name || !email || !password) {
        setErrorMessage('Please fill in all contact details.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password should be at least 6 characters.');
        return;
      }
      setErrorMessage(null);
      setStep(3);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToSafety || !agreedToTerms) {
      setErrorMessage('Please accept the food safety guidelines and terms of service.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        role,
        orgName,
        orgType,
        address,
        phone,
        lat: 37.788 + (Math.random() - 0.5) * 0.02,
        lng: -122.405 + (Math.random() - 0.5) * 0.02
      });

      await notifyAction(
        '✨ Organization Registered!',
        `Welcome to FoodLink AI! ${orgName} (${orgType}) has been verified.`,
        'approval'
      );

      setSuccessMessage('Registration successful! Setting up your FoodLink AI portal...');
      setTimeout(() => {
        onNavigateToDashboard(role);
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Registration Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                <span>🌱 Join the Zero Waste Movement</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Register Your Organization
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Start redistributing surplus food or receiving verified donations in under 2 minutes.
              </p>
            </div>

            {/* Step Wizard Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      step === num
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                        : step > num
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step > num ? '✓' : num}
                  </div>
                  {num < 3 && <div className="w-4 h-0.5 bg-slate-200 dark:bg-slate-800" />}
                </div>
              ))}
            </div>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2"
            >
              <span>🎉</span>
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* STEP 1: Organization Role & Category */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  1. Select Primary Organization Role
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setRole('restaurant');
                      setOrgType('Restaurant');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'restaurant'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
                        👨‍🍳
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Food Donor</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Restaurants, Hotels, Bakeries, Supermarkets & Caterers with surplus food.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setRole('ngo');
                      setOrgType('Food Bank');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      role === 'ngo'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl font-bold">
                        🤝
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">NGO / Food Bank</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Shelters, Community Kitchens & Non-Profits distributing meals to people in need.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={role === 'restaurant' ? 'e.g. Bella Italia Bistro' : 'e.g. San Francisco Food Bank'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Sub-Category
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {orgTypesByRole[role].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 550 Market St, San Francisco, CA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  Continue to Contact Details →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Account Representative Credentials */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Contact Person & Account Security
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (Representative)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chef Marco Rossi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marco@organization.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  Proceed to Safety Terms →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Food Safety & Compliance */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-5 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                3. Food Safety Guidelines & Verification
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3 text-emerald-950 dark:text-emerald-200">
                <div className="font-bold flex items-center gap-2 text-sm">
                  <span>🛡️ Good Samaritan Food Donation Compliance</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Under the Bill Emerson Good Samaritan Food Donation Act, donors are protected from legal liability when donating wholesome food in good faith. To maintain this status:
                </p>
                <ul className="list-disc pl-5 text-[11px] space-y-1">
                  <li>Meals must be prepared in licensed, inspected commercial kitchens.</li>
                  <li>Perishable items must be refrigerated below 41°F (5°C) or kept hot above 135°F (57°C).</li>
                  <li>Packages must clearly specify allergen indicators (dairy, nuts, gluten).</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreedToSafety}
                    onChange={(e) => setAgreedToSafety(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    I certify that all surplus food donated through FoodLink AI complies with local food hygiene regulations and temperature log requirements.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    I agree to the FoodLink AI Terms of Service, Privacy Policy, and Community Redistribution Guidelines.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span> Complete Registration & Launch Portal →</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Already registered with FoodLink AI? </span>
            <button
              onClick={onNavigateToLogin}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Sign in to your portal
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
