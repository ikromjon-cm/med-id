'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, CalendarDays,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { getClinicDetail } from '@/lib/mockData';
import { t } from '@/lib/i18n';
import type { ClinicFinance } from '@/lib/types';

const CLINIC_ID = 'CLN-001';

export default function FinancePage() {
  const [finance, setFinance] = useState<ClinicFinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const detail = await getClinicDetail(CLINIC_ID);
      setFinance(detail?.finance || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  if (error) return <ErrorState onRetry={loadData} />;

  const totalRevenue = finance.reduce((sum, f) => sum + f.revenue, 0);
  const totalExpenses = finance.reduce((sum, f) => sum + f.expenses, 0);
  const totalAppointments = finance.reduce((sum, f) => sum + f.appointments, 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : '0';

  const lastMonth = finance[finance.length - 1];
  const prevMonth = finance[finance.length - 2];
  const revenueTrend = prevMonth ? ((lastMonth?.revenue - prevMonth?.revenue) / prevMonth.revenue * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 ">{t('Finance')}</h2>
        <p className="text-sm text-gray-500  mt-1">{t('Revenue statistics and financial overview')}</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00C896]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#00C896]" />
              </div>
              <span className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', Number(revenueTrend) >= 0 ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-emergency/10 text-emergency')}>
                {Number(revenueTrend) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(Number(revenueTrend))}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 ">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 ">{t('Total Revenue')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emergency/10 flex items-center justify-center mb-3">
              <TrendingDown className="w-5 h-5 text-emergency" />
            </div>
            <p className="text-2xl font-bold text-gray-900 ">${totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500 ">{t('Total Expenses')}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-gray-900 ">${profit.toLocaleString()}</p>
            <p className="text-sm text-gray-500 ">{t('Net Profit')} ({profitMargin}%)</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50  flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 ">{totalAppointments.toLocaleString()}</p>
            <p className="text-sm text-gray-500 ">{t('Total Appointments')}</p>
          </motion.div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="chart" />
      ) : (
        <ChartCard title={t('Revenue vs Expenses')} subtitle={t('Monthly financial comparison')}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={finance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" name={t('Revenue')} fill="#00C896" radius={[6, 6, 0, 0]} maxBarSize={30} />
              <Bar dataKey="expenses" name={t('Expenses')} fill="#FF4D4F" radius={[6, 6, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {loading ? (
        <LoadingSkeleton type="chart" />
      ) : (
        <ChartCard title={t('Appointments Trend')} subtitle={t('Monthly appointment count')}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={finance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
              <Line type="monotone" dataKey="appointments" stroke="#0F6FFF" strokeWidth={2.5} dot={{ fill: '#0F6FFF', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) { return classes.filter(Boolean).join(' '); }
