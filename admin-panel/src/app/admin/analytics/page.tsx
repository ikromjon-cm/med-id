'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import {
  getUserGrowthData, getEmergencyAccessData, getDocumentStats,
  getRoleDistribution, getMonthlyActiveUsers
} from '@/lib/mockData';
import type { ChartDataPoint } from '@/lib/types';
import { t } from '@/lib/i18n';

const COLORS = ['#0F6FFF', '#00C896', '#FF4D4F', '#FFB020', '#7C3AED', '#F59E0B'];

export default function AnalyticsPage() {
  const [userGrowth, setUserGrowth] = useState<ChartDataPoint[]>([]);
  const [emergencyAccess, setEmergencyAccess] = useState<ChartDataPoint[]>([]);
  const [documentStats, setDocumentStats] = useState<ChartDataPoint[]>([]);
  const [roleDist, setRoleDist] = useState<ChartDataPoint[]>([]);
  const [monthlyActive, setMonthlyActive] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [ug, ea, ds, rd, ma] = await Promise.all([
        getUserGrowthData(), getEmergencyAccessData(), getDocumentStats(),
        getRoleDistribution(), getMonthlyActiveUsers()
      ]);
      setUserGrowth(ug); setEmergencyAccess(ea); setDocumentStats(ds);
      setRoleDist(rd); setMonthlyActive(ma);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Analytics')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Comprehensive platform analytics and insights')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
          </>
        ) : (
          <>
            <ChartCard title={t('Users Growth')} subtitle={t('Monthly growth over the last 12 months')} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <Line type="monotone" dataKey="users" stroke="#0F6FFF" strokeWidth={2.5} dot={{ fill: '#0F6FFF', r: 4 }} activeDot={{ r: 6 }} name={t('Total Users')} />
                  <Line type="monotone" dataKey="patients" stroke="#00C896" strokeWidth={2.5} dot={{ fill: '#00C896', r: 4 }} name={t('Patients')} />
                  <Line type="monotone" dataKey="doctors" stroke="#FFB020" strokeWidth={2.5} dot={{ fill: '#FFB020', r: 4 }} name={t('Doctors')} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t('Emergency Access')} subtitle={t('Emergency vs Routine access patterns')}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={emergencyAccess}>
                  <defs>
                    <linearGradient id="eaEmergency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D4F" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#FF4D4F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="eaRoutine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F6FFF" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0F6FFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <Area type="monotone" dataKey="emergency" stroke="#FF4D4F" strokeWidth={2} fill="url(#eaEmergency)" name={t('Emergency')} />
                  <Area type="monotone" dataKey="routine" stroke="#0F6FFF" strokeWidth={2} fill="url(#eaRoutine)" name={t('Routine')} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t('Documents by Type')} subtitle={t('Distribution across document categories')}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={documentStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={25}>
                    {documentStats.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t('Role Distribution')} subtitle={t('User distribution by role')}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {roleDist.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t('Monthly Active Users')} subtitle={t('Active users per month')} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyActive}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} />
                  <Bar dataKey="active" fill="#0F6FFF" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {monthlyActive.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
}
