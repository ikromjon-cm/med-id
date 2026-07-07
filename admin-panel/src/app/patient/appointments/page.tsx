'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Calendar, Clock, Stethoscope, MapPin, ArrowRight,
  CheckCircle2, XCircle
} from 'lucide-react';
import { appointments } from '@/lib/mockData';
import type { Appointment } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { t } from '@/lib/i18n';

const statusConfig = {
  scheduled: { label: t('Scheduled'), color: 'text-primary', bg: 'bg-primary/10', icon: Clock },
  'in-progress': { label: t('In Progress'), color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: ArrowRight },
  completed: { label: t('Completed'), color: 'text-secondary', bg: 'bg-secondary/10', icon: CheckCircle2 },
  cancelled: { label: t('Cancelled'), color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800/50', icon: XCircle },
};

const tabs = [
  { key: 'upcoming', label: t('Upcoming'), filter: (a: Appointment) => a.status === 'scheduled' || a.status === 'in-progress' },
  { key: 'past', label: t('Past'), filter: (a: Appointment) => a.status === 'completed' },
  { key: 'cancelled', label: t('Cancelled'), filter: (a: Appointment) => a.status === 'cancelled' },
  { key: 'all', label: t('All'), filter: () => true },
];

export default function AppointmentsPage() {
  const [allAppts, setAllAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const patientId = 'PAT-001';

  useEffect(() => {
    async function load() {
      const myAppts = appointments
        .filter(a => a.patientId === patientId)
        .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());
      setAllAppts(myAppts);
      setLoading(false);
    }
    load();
  }, []);

  const currentTab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filteredAppts = allAppts.filter(currentTab.filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700/50 rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse" />
          ))}
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700/50" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700/50 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('My Appointments')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {allAppts.filter(a => a.status === 'scheduled').length} {t('upcoming appointment')}{allAppts.filter(a => a.status === 'scheduled').length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
              activeTab === tab.key
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white/70 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:border-primary/30'
            )}
          >
            {tab.label} ({allAppts.filter(tab.filter).length})
          </button>
        ))}
      </motion.div>

      {filteredAppts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl"
        >
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {t('No')} {currentTab.label.toLowerCase()} {t('appointments').toLowerCase()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
              {activeTab === 'upcoming'
                ? t('No upcoming appointments found. Schedule one with your doctor.')
                : activeTab === 'past'
                ? t('No completed appointments found.')
                : t('No cancelled appointments.')}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredAppts.map((appt, i) => {
            const config = statusConfig[appt.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary/70 flex items-center justify-center text-white flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {appt.doctorName}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium w-fit',
                        config.bg,
                        config.color
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(appt.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Stethoscope className="w-3.5 h-3.5" />
                        {appt.type}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {appt.clinicName}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/5 text-primary border border-primary/10">
                      {appt.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
