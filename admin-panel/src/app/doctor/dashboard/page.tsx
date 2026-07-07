'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, CalendarDays, Stethoscope, Pill,
  ChevronRight
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { getDoctorDashboardStats, getTodayAppointments } from '@/lib/mockData';
import type { DoctorDashboardStats, Appointment } from '@/lib/types';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const DOCTOR_ID = 'DOC-001';

const statusStyles: Record<string, string> = {
  scheduled: 'bg-primary/10 text-primary',
  'in-progress': 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',
  completed: 'bg-[#00C896]/10 text-[#00C896]',
  cancelled: 'bg-gray-100 dark:bg-gray-800/50 text-gray-400',
};

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState<DoctorDashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, a] = await Promise.all([
        getDoctorDashboardStats(DOCTOR_ID),
        getTodayAppointments(DOCTOR_ID),
      ]);
      setStats(s);
      setAppointments(a);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Doctor Dashboard')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Welcome back, Doctor')}</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t("Today's Patients")} value={stats!.todayPatients} icon={<Users className="w-6 h-6" />} color="primary" delay={0} />
          <StatCard title={t('Upcoming Appointments')} value={stats!.upcomingAppointments} icon={<CalendarDays className="w-6 h-6" />} color="secondary" delay={0.1} />
          <StatCard title={t('Pending Diagnoses')} value={stats!.pendingDiagnoses} icon={<Stethoscope className="w-6 h-6" />} color="amber" delay={0.2} />
          <StatCard title={t('Active Prescriptions')} value={stats!.activePrescriptions} icon={<Pill className="w-6 h-6" />} color="emergency" delay={0.3} />
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="chart" />
      ) : (
        <ChartCard title={t("Today's Appointments")} subtitle={`${appointments.length} ${t('appointment(s) scheduled')}`}>
          {appointments.length === 0 ? (
            <EmptyState title={t('No appointments today')} description={t('You have no appointments scheduled for today.')} />
          ) : (
            <div className="space-y-2">
              {appointments.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <div className="text-center flex-shrink-0 w-12">
                    <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{apt.time.split(':')[0]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.time.split(':')[1]}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-700/50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{apt.patientName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{apt.type} • {apt.date}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full capitalize', statusStyles[apt.status])}>
                    {apt.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              ))}
            </div>
          )}
        </ChartCard>
      )}
    </div>
  );
}
