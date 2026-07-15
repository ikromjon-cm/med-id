'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bell, AlertTriangle, RefreshCw,
  Shield, CheckCircle2, Clock
} from 'lucide-react';
import { getNotifications } from '@/lib/mockData';
import type { Notification } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { t } from '@/lib/i18n';

const typeIcons: Record<string, React.ReactNode> = {
  Alert: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  Reminder: <Clock className="w-5 h-5 text-primary" />,
  Update: <RefreshCw className="w-5 h-5 text-blue-500" />,
  Emergency: <Shield className="w-5 h-5 text-emergency" />,
};

const typeColors: Record<string, string> = {
  Alert: 'bg-amber-50  border-amber-200 ',
  Reminder: 'bg-blue-50  border-blue-200 ',
  Update: 'bg-blue-50  border-blue-200 ',
  Emergency: 'bg-emergency/5 border-emergency/20',
};

export default function NotificationsPage() {
  const [allNotifs, setAllNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const notifs = await getNotifications();
      setAllNotifs(notifs);
      setLoading(false);
    }
    load();
  }, []);

  const notifTypes = ['All', 'Alert', 'Reminder', 'Update', 'Emergency'];
  const filtered = filter === 'All' ? allNotifs : allNotifs.filter(n => n.type === filter);
  const markAsRead = (id: string) => setReadIds(prev => new Set(prev).add(id));

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-200 " />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200  rounded mb-2" />
                <div className="h-3 w-full bg-gray-200  rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const unreadCount = allNotifs.filter(n => !readIds.has(n.id)).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 ">{t('Notifications')}</h2>
            <p className="text-sm text-gray-500 ">
              {unreadCount} {t('unread notification')}
            </p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {notifTypes.map(nt => (
            <button
              key={nt}
              onClick={() => setFilter(nt)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
                filter === nt
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white/70  text-gray-600  border border-gray-200  hover:border-primary/30'
              )}
            >
              {nt === 'All' ? t('All') : t(nt)}{nt !== 'All' ? ` (${allNotifs.filter(n => n.type === nt).length})` : ` (${allNotifs.length})`}
            </button>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl"
        >
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gray-100  flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400 " />
            </div>
            <h3 className="text-lg font-semibold text-gray-900  mb-1">{t('No notifications')}</h3>
            <p className="text-sm text-gray-500  text-center max-w-sm">
              {filter === 'All' ? t('You have no notifications at this time.') : `${t('No')} ${filter.toLowerCase()} ${t('Notifications').toLowerCase()}.`}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif, i) => {
            const isRead = readIds.has(notif.id);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  'glass-card rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all duration-200',
                  !isRead && 'border-primary/20',
                  typeColors[notif.type]
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    notif.type === 'Emergency' ? 'bg-emergency/10' :
                    notif.type === 'Alert' ? 'bg-amber-50 ' :
                    'bg-primary/5'
                  )}>
                    {typeIcons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        'text-sm',
                        isRead ? 'font-medium text-gray-600 ' : 'font-semibold text-gray-900 '
                      )}>
                        {notif.title}
                      </h3>
                      {!isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className={cn(
                      'text-sm leading-relaxed',
                      isRead ? 'text-gray-500 ' : 'text-gray-700 '
                    )}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400 ">
                        {formatDateTime(notif.createdAt)}
                      </span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        notif.status === 'Sent' ? 'bg-secondary/10 text-secondary' :
                        notif.status === 'Pending' ? 'bg-amber-50 text-amber-600  ' :
                        'bg-emergency/10 text-emergency'
                      )}>
                        {notif.status === 'Sent' ? t('Sent') : t('Pending')}
                      </span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium',
                        notif.type === 'Emergency' ? 'bg-emergency/10 text-emergency' :
                        notif.type === 'Alert' ? 'bg-amber-50 text-amber-600  ' :
                        notif.type === 'Reminder' ? 'bg-primary/10 text-primary' :
                        'bg-blue-50 text-blue-600  '
                      )}>
                        {notif.type}
                      </span>
                    </div>
                  </div>
                  {isRead && <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-1" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
