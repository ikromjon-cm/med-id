'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays, Users, Stethoscope, DollarSign,
  Clock, UserCheck, CheckCircle2, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import {
  getClinicDashboardStats,
  getClinicDetail
} from '@/lib/mockData';
import { t } from '@/lib/i18n';
import type { ClinicDashboardStats, ClinicFinance } from '@/lib/types';

const CLINIC_ID = 'CLN-001';
const COLORS = ['#0F6FFF', '#FFB020', '#00C896'];

export default function ClinicDashboardPage() {
  const [stats, setStats] = useState<ClinicDashboardStats | null>(null);
  const [finance, setFinance] = useState<ClinicFinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, detail] = await Promise.all([
        getClinicDashboardStats(CLINIC_ID),
        getClinicDetail(CLINIC_ID),
      ]);
      setStats(s);
      setFinance(detail?.finance || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (error) return <ErrorState onRetry={loadData} />;

  const queueData = stats ? [
    { name: t('Waiting'), value: stats.queueStatus.waiting },
    { name: t('With Doctor'), value: stats.queueStatus.withDoctor },
    { name: t('Completed'), value: stats.queueStatus.completed },
  ] : [];

  const appointTrend = finance.map(f => ({ name: f.date, appointments: f.appointments }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Clinic Dashboard')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Overview of your clinic operations')}</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t("Today's Appointments")} value={stats!.todayAppointments} icon={<CalendarDays className="w-6 h-6" />} color="primary" delay={0} />
          <StatCard title={t('Total Patients')} value={stats!.totalPatients.toLocaleString()} icon={<Users className="w-6 h-6" />} color="secondary" delay={0.1} />
          <StatCard title={t('Doctors')} value={stats!.totalDoctors} icon={<Stethoscope className="w-6 h-6" />} color="amber" delay={0.2} />
          <StatCard title={t("Today's Revenue")} value={`$${stats!.todayRevenue.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} color="emergency" delay={0.3} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
          </>
        ) : (
          <>
            <ChartCard title={t('Queue Status')} subtitle={t('Current queue distribution')}>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="60%" height={280}>
                  <PieChart>
                    <Pie data={queueData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {queueData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {queueData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.name}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard title={t('Appointments Trend')} subtitle={t('Monthly appointments count')}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={appointTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <Bar dataKey="appointments" fill="#0F6FFF" radius={[6, 6, 0, 0]} maxBarSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.queueStatus.waiting || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('Waiting')}</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((stats?.queueStatus.waiting || 0) / Math.max(1, (stats?.queueStatus.waiting || 0) + (stats?.queueStatus.withDoctor || 0) + (stats?.queueStatus.completed || 0))) * 100)}%` }} className="h-2 rounded-full bg-amber-500" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.queueStatus.withDoctor || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('With Doctor')}</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((stats?.queueStatus.withDoctor || 0) / Math.max(1, (stats?.queueStatus.waiting || 0) + (stats?.queueStatus.withDoctor || 0) + (stats?.queueStatus.completed || 0))) * 100)}%` }} className="h-2 rounded-full bg-primary" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C896]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#00C896]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.queueStatus.completed || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('Completed')}</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((stats?.queueStatus.completed || 0) / Math.max(1, (stats?.queueStatus.waiting || 0) + (stats?.queueStatus.withDoctor || 0) + (stats?.queueStatus.completed || 0))) * 100)}%` }} className="h-2 rounded-full bg-[#00C896]" />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
