'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';
import { getNotifications } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';

const typeColors: Record<string, string> = {
  Emergency: 'bg-emergency/10 text-emergency',
  Alert: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',
  Update: 'bg-primary/10 text-primary',
  Reminder: 'bg-[#00C896]/10 text-[#00C896]',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getNotifications().then(data => { setNotifs(data); setLoading(false); });
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifs.filter(n => n.status === 'Pending').length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-emergency text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-emergency/30">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{notifs.length} total</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/30">
                {notifs.slice(0, 5).map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', typeColors[n.type])}>
                        {n.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{formatDateTime(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full text-xs text-primary font-medium hover:text-primary-dark transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
