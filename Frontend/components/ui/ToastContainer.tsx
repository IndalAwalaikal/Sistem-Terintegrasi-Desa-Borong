'use client';

import React from 'react';
import { useToastStore, ToastItem } from '@/store/toastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

function getToastIcon(type: ToastItem['type']) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
  }
}

function getToastStyles(type: ToastItem['type']) {
  switch (type) {
    case 'success':
      return 'bg-white dark:bg-neutral-900 border-emerald-500/40 text-neutral-900 dark:text-neutral-100 shadow-emerald-500/10';
    case 'error':
      return 'bg-white dark:bg-neutral-900 border-rose-500/40 text-neutral-900 dark:text-neutral-100 shadow-rose-500/10';
    case 'warning':
      return 'bg-white dark:bg-neutral-900 border-amber-500/40 text-neutral-900 dark:text-neutral-100 shadow-amber-500/10';
    case 'info':
    default:
      return 'bg-white dark:bg-neutral-900 border-sky-500/40 text-neutral-900 dark:text-neutral-100 shadow-sky-500/10';
  }
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl transition-all duration-300 transform animate-slide-in-right ${getToastStyles(
            toast.type
          )}`}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1 text-xs sm:text-sm font-semibold leading-snug">
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            aria-label="Tutup Pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
