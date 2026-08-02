import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onNavigateToDashboard: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
  onNavigateToDashboard
}) => {
  const { login } = useAuth();
  const { notifyAction } = useFood();

  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('restaurant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const demoAccounts = [
    {
      name: 'Chef Marco Rossi',
      email: 'marco@greenbites.com',
      role: 'restaurant' as UserRole,
      org: 'GreenBites Organic Bistro',
      type: 'Restaurant Donor',
      badge: 'Zero Waste Pioneer'
    },
    {
      name: 'Elena Rostova',
      email: 'elena@grandhyattsf.com',
      role: 'restaurant' as UserRole,
      org: 'Grand Hyatt Executive Dining',
      type: 'Hotel Donor',
      badge: 'Community Shield'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah@hopekitchen.org',
      role: 'ngo' as UserRole,
      org: 'Hope Community Kitchen',
      type: 'NGO / Food Bank',
      badge: 'Master Distributor'
    },
    {
      name: 'Admin Operations',
      email: 'admin@foodlink.ai',
      role: 'admin' as UserRole,
      org: 'FoodLink Global Operations',
      type: 'System Operator',
      badge: 'HQ Admin'
    }
  ];

  const handleQuickFill = async (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword('demoPass2026!');
    setSelectedRoleTab(acc.role);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(acc.email, 'demoPass2026!');
      await notifyAction('🔑 Session Authenticated!', `Welcome back, ${acc.name}! Logged into ${acc.org}.`, 'system');
      setSuccessMessage(`Welcome back, ${acc.name}! Redirecting to ${acc.org}...`);
      setTimeout(() => {
        onNavigateToDashboard(acc.role);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Quick login failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      await notifyAction('🔑 Login Successful!', `Authenticated as ${email} (${selectedRoleTab.toUpperCase()}).`, 'system');
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        onNavigateToDashboard(selectedRoleTab);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. You can also click a quick demo account below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setResetSent(false);
      setResetEmail('');
      setSuccessMessage('Password reset link sent to ' + resetEmail);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Informational Hero Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Background Radial Pattern */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-6">
              <span>🍽️ FoodLink AI Portal</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
              Connecting Food Donors & Communities
            </h1>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              Join hundreds of restaurants, hotels, bakeries, and NGOs rescuing tons of edible surplus food daily with real-time AI freshness matching.
            </p>

            <div className="space-y-3 pt-4 border-t border-emerald-800/60 text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 font-bold">✓</span>
                <span>AI-powered freshness score & safe dispatch</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 font-bold">✓</span>
                <span>Automated tax deduction receipts & ESG logs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 font-bold">✓</span>
                <span>Good Samaritan Act legal protection verified</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-slate-400">
            <span>FoodLink AI Engine v2.6</span>
            <span className="text-emerald-400 font-medium">99.8% Safety Index</span>
          </div>
        </motion.div>

        {/* Right Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to Your Account</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Access your dashboard, donation listings, or pickup requests.
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-xl shadow-inner">
                🔑
              </div>
            </div>

            {/* Role Tab Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Select Your Portal Type
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('restaurant')}
                  className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoleTab === 'restaurant'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                  }`}
                >
                  <span>👨‍🍳</span>
                  <span className="truncate">Donor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('ngo')}
                  className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoleTab === 'ngo'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                  }`}
                >
                  <span>🤝</span>
                  <span className="truncate">NGO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoleTab('admin')}
                  className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoleTab === 'admin'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                  }`}
                >
                  <span>🛡️</span>
                  <span className="truncate">Admin</span>
                </button>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2"
              >
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2"
              >
                <span>✅</span>
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Keep me signed in for 7 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to {selectedRoleTab.toUpperCase()} Portal →</span>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ⚡ Quick Demo Accounts
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">1-Click Instant Login</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all text-left flex items-center gap-2 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                      {acc.role === 'restaurant' ? '🍳' : acc.role === 'ngo' ? '🤝' : '🛡️'}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {acc.org}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>New to FoodLink AI? </span>
            <button
              onClick={onNavigateToRegister}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Register Your Organization
            </button>
          </div>
        </motion.div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Reset Password</h3>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter your registered organization email address and we'll send you an encrypted password reset link.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={resetSent}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
              >
                {resetSent ? 'Sending Email...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
