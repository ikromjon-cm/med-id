'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Stethoscope, Building2, FileText,
  Activity, Clock, UserPlus, Shield, Download
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import {
  getDashboardStats, getUserGrowthData, getEmergencyAccessData,
  getDocumentStats, getRoleDistribution, getRecentActivity
} from '@/lib/mockData';
import type { DashboardStats, ChartDataPoint } from '@/lib/types';

const COLORS = ['#0F6FFF', '#00C896', '#FF4D4F', '#FFB020', '#7C3AED', '#F59E0B'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userGrowth, setUserGrowth] = useState<ChartDataPoint[]>([]);
  const [emergencyAccess, setEmergencyAccess] = useState<ChartDataPoint[]>([]);
  const [documentStats, setDocumentStats] = useState<ChartDataPoint[]>([]);
  const [roleDist, setRoleDist] = useState<ChartDataPoint[]>([]);
  const [activity, setActivity] = useState<{ action: string; user: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, ug, ea, ds, rd, ra] = await Promise.all([
        getDashboardStats(),
        getUserGrowthData(),
        getEmergencyAccessData(),
        getDocumentStats(),
        getRoleDistribution(),
        getRecentActivity(),
      ]);
      setStats(s);
      setUserGrowth(ug);
      setEmergencyAccess(ea);
      setDocumentStats(ds);
      setRoleDist(rd);
      setActivity(ra);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time platform statistics and metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-4 h-4" />
          Export Report
        </motion.button>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={stats!.totalPatients.toLocaleString()}
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 12.5, isUp: true }}
            subtitle="+156 this month"
            color="primary"
            delay={0}
          />
          <StatCard
            title="Active Doctors"
            value={stats!.totalDoctors.toLocaleString()}
            icon={<Stethoscope className="w-6 h-6" />}
            trend={{ value: 8.2, isUp: true }}
            subtitle="+12 this month"
            color="secondary"
            delay={0.1}
          />
          <StatCard
            title="Total Clinics"
            value={stats!.totalClinics.toLocaleString()}
            icon={<Building2 className="w-6 h-6" />}
            trend={{ value: 3.1, isUp: true }}
            subtitle="+2 this month"
            color="amber"
            delay={0.2}
          />
          <StatCard
            title="Documents"
            value={stats!.totalDocuments.toLocaleString()}
            icon={<FileText className="w-6 h-6" />}
            trend={{ value: 18.7, isUp: true }}
            subtitle="+890 this month"
            color="emergency"
            delay={0.3}
          />
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
            <ChartCard title="Users Growth" subtitle="Monthly platform user growth">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#0F6FFF" strokeWidth={2.5} dot={{ fill: '#0F6FFF', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="doctors" stroke="#00C896" strokeWidth={2.5} dot={{ fill: '#00C896', r: 4 }} />
                  <Line type="monotone" dataKey="patients" stroke="#FFB020" strokeWidth={2.5} dot={{ fill: '#FFB020', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Emergency Access" subtitle="Emergency vs Routine access frequency">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={emergencyAccess}>
                  <defs>
                    <linearGradient id="emergencyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D4F" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#FF4D4F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="routineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F6FFF" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0F6FFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <Area type="monotone" dataKey="emergency" stroke="#FF4D4F" strokeWidth={2} fill="url(#emergencyGrad)" />
                  <Area type="monotone" dataKey="routine" stroke="#0F6FFF" strokeWidth={2} fill="url(#routineGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <LoadingSkeleton type="chart" className="lg:col-span-2" />
            <LoadingSkeleton type="chart" />
          </>
        ) : (
          <>
            <ChartCard title="Documents by Type" subtitle="Distribution of medical documents" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={documentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <Bar dataKey="value" fill="#0F6FFF" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {documentStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Role Distribution" subtitle="Users by role">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        <ChartCard title="Recent Activity" subtitle="Latest platform activities">
          <div className="space-y-0">
            {activity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 py-3 border-b last:border-b-0 border-gray-50 dark:border-gray-800/30"
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  i < 3 ? 'bg-primary/10 text-primary' : i < 6 ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                )}>
                  {i < 3 ? <UserPlus className="w-4 h-4" /> : i < 6 ? <Activity className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white truncate">{item.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">by {item.user}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}

function cn(...classes: any[]) { return classes.filter(Boolean).join(' '); }
