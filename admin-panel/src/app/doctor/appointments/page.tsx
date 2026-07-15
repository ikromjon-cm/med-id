'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  CalendarDays, Stethoscope, ChevronRight
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { getTodayAppointments, getUpcomingAppointments } from '@/lib/mockData';
import { t } from '@/lib/i18n';
import type { Appointment } from '@/lib/types';

const DOCTOR_ID = 'DOC-001';

export default function DoctorAppointmentsPage() {
  const [today, setToday] = useState<Appointment[]>([]);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<'today' | 'upcoming'>('today');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [t, u] = await Promise.all([
        getTodayAppointments(DOCTOR_ID),
        getUpcomingAppointments(DOCTOR_ID),
      ]);
      setToday(t);
      setUpcoming(u);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  if (error) return <ErrorState onRetry={loadData} />;

  const currentList = tab === 'today' ? today : upcoming;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 ">{t('Appointments')}</h2>
        <p className="text-sm text-gray-500  mt-1">{t('View and manage your appointments')}</p>
      </div>

      <div className="flex items-center gap-2">
        {(['today', 'upcoming'] as const).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
              tab === tabKey
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/70  text-gray-600  hover:bg-gray-100 '
            )}
          >
            {tabKey === 'today' ? t("Today's") : t('Upcoming')}
            <span className="ml-1.5 text-xs opacity-80">({(tabKey === 'today' ? today : upcoming).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : currentList.length === 0 ? (
        <EmptyState title={t('No appointments')} description={tab === 'today' ? t('No appointments scheduled for today.') : t('No upcoming appointments.')} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-100 ">
            {currentList.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50  transition-colors"
              >
                <div className="text-center flex-shrink-0 w-14">
                  <p className="text-lg font-bold text-gray-900  leading-tight">{apt.time.split(':')[0]}</p>
                  <p className="text-xs text-gray-500 ">{apt.time.split(':')[1]}</p>
                </div>
                <div className="w-px h-12 bg-gray-200  flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 ">{apt.patientName}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 ">
                    <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" />{apt.doctorName}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{apt.date}</span>
                    <span>{apt.type}</span>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
