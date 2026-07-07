'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
      >
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          A
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Admin User</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">admin@medid.com</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@medid.com</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">{t('Administrator')}</span>
            </div>
            <div className="py-1">
              <button
                onClick={() => { router.push('/settings'); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                {t('Settings')}
              </button>
              <button
                onClick={() => { router.push('/login'); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emergency hover:bg-emergency/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('Logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
