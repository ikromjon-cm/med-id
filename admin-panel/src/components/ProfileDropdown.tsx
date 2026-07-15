'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
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
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100  transition-all"
      >
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          A
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900  leading-tight">Admin User</p>
          <p className="text-[11px] text-gray-500  leading-tight">admin@medid.com</p>
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
            className="absolute right-0 mt-2 w-56 bg-white  rounded-2xl shadow-2xl border border-gray-200  overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 ">
              <p className="text-sm font-medium text-gray-900 ">Admin User</p>
              <p className="text-xs text-gray-500 ">admin@medid.com</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-50  text-purple-600 ">{t('Administrator')}</span>
            </div>
            <div className="py-1">
              <button
                onClick={() => { router.push('/settings'); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700  hover:bg-gray-50  transition-colors"
              >
                <Settings className="w-4 h-4" />
                {t('Settings')}
              </button>
              <button
                onClick={() => { document.cookie = 'medid_role=; path=/; max-age=0'; window.location.href = '/login'; }}
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

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
