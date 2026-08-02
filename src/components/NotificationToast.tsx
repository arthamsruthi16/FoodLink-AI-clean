import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { Notification } from '../types';

interface ToastItem extends Notification {
  toastId: string;
}

interface NotificationToastProps {
  toasts: ToastItem[];
  onDismiss: (toastId: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let badgeColor = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
          let icon = '🔔';

          if (toast.type === 'donation') {
            badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            icon = '🍲';
          } else if (toast.type === 'pickup') {
            badgeColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
            icon = '🚚';
          } else if (toast.type === 'urgency') {
            badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            icon = '⚠️';
          } else if (toast.type === 'approval') {
            badgeColor = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
            icon = '✅';
          }

          return (
            <motion.div
              key={toast.toastId}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-start gap-3 text-xs overflow-hidden relative"
            >
              <div className={`p-2 rounded-xl text-lg flex items-center justify-center border ${badgeColor}`}>
                {icon}
              </div>

              <div className="flex-1 space-y-0.5 pr-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {toast.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => onDismiss(toast.toastId)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors"
              >
                ✕
              </button>

              {/* Progress bar line */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
