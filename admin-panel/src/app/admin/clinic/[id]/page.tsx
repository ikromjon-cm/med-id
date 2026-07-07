'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, MapPin, Phone, Users, Calendar, DollarSign, UserPlus, ListOrdered, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import AppointmentCard from '@/components/AppointmentCard';
import QueueStatus from '@/components/QueueStatus';
import ClinicFinanceChart from '@/components/ClinicFinanceChart';
import StaffCard from '@/components/StaffCard';
import { getClinicDetail, getClinics } from '@/lib/mockData';
import type { Clinic, Doctor } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function ClinicDetailPage() {
  const params = useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getClinicDetail>>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getClinicDetail(params.id as string);
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  if (error) return <ErrorState onRetry={load} />;
  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-6">
        <Link href="/clinic" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('Back to Clinics')}
        </Link>
        <EmptyState title={t('Clinic not found')} description={t('The requested clinic could not be found.')} />
      </div>
    );
  }

  const { clinic, doctors, queue, appointments, finance } = data;
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10));
  const activeDoctors = doctors.filter(d => d.status === 'active');
  const totalRevenue = finance.reduce((s, f) => s + f.revenue, 0);

  return (
    <div className="space-y-6">
      <Link href="/clinic" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('Back to Clinics')}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clinic-card-gradient glass-card rounded-2xl p-6"
      >
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#00C896]/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-10 h-10 text-[#00C896]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{clinic.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{clinic.id}</p>
              </div>
              <StatusBadge status={clinic.status} size="md" />
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {clinic.address}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {clinic.phone}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('Doctors')} value={doctors.length} icon={<Users className="w-5 h-5" />} delay={0} color="primary" subtitle={`${activeDoctors.length} ${t('active')}`} />
        <StatCard title={t('Queue')} value={queue.filter(q => q.status !== 'COMPLETED').length} icon={<ListOrdered className="w-5 h-5" />} delay={0.1} color="amber" subtitle={t('Waiting')} />
        <StatCard title={t('Today Appt.')} value={todayAppointments.length} icon={<Calendar className="w-5 h-5" />} delay={0.2} color="secondary" subtitle={t('Scheduled')} />
        <StatCard title={t('Revenue')} value={`$${(totalRevenue / 1000).toFixed(0)}k`} icon={<DollarSign className="w-5 h-5" />} delay={0.3} color="emergency" subtitle={t('Annual')} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
          <UserPlus className="w-4 h-4" /> {t('Add Doctor')}
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
          <ListOrdered className="w-4 h-4" /> {t('View Queue')}
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
          <BarChart3 className="w-4 h-4" /> {t('View Finance')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('Queue Status')} subtitle={t('Current patient queue')}>
          <QueueStatus entries={queue} />
        </ChartCard>

        <ChartCard title={t('Finance Overview')} subtitle={t('Monthly revenue and expenses')}>
          <ClinicFinanceChart data={finance} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('Staff & Doctors')} subtitle={`${doctors.length} ${t('doctors assigned')}`}>
          {doctors.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">{t('No doctors assigned to this clinic')}</p>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {doctors.map((d, i) => (
                <StaffCard key={d.id} name={d.name} role="doctor" status={d.status} delay={i * 0.03} />
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title={t('Today\'s Appointments')} subtitle={`${todayAppointments.length} ${t('for today')}`}>
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">{t('No appointments scheduled for today')}</p>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {todayAppointments.map((a, i) => (
                <AppointmentCard key={a.id} appointment={a} delay={i * 0.03} />
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
