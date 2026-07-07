'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Activity, Clock, CheckCircle2,
  Zap, ShieldAlert, ArrowRight
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { getEmergencyStats, getActiveEmergencyAlerts, getRecentActivity } from '@/lib/mockData';
import type { EmergencyAlert } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

export default function EmergencyDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{ totalAlerts: number; activeAlerts: number; resolvedToday: number; avgResponseTime: string } | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [activity, setActivity] = useState<{ action: string; user: string; time: string }[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyLog, setEmergencyLog] = useState<{ action: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, a, ra] = await Promise.all([
        getEmergencyStats(),
        getActiveEmergencyAlerts(),
        getRecentActivity(),
      ]);
      setStats(s);
      setActiveAlerts(a);
      setActivity(ra);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Emergency Dashboard')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Real-time emergency response overview')}</p>
        </div>
        {stats && stats.activeAlerts > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emergency/10 text-emergency text-sm font-medium emergency-glow">
            <span className="w-2 h-2 rounded-full bg-emergency blink-alert" />
            {stats.activeAlerts} {t('Active')} {t('Alert')}{stats.activeAlerts !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Emergency Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('glass-card rounded-2xl p-6 border-2', emergencyMode ? 'emergency-glow border-emergency/50' : 'border-transparent')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', emergencyMode ? 'bg-emergency/20' : 'bg-gray-100 dark:bg-gray-800/50')}>
              <Zap className={cn('w-5 h-5', emergencyMode ? 'text-emergency' : 'text-gray-400')} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Favqulodda Rejim</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {emergencyMode ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emergency">
                    <span className="w-2 h-2 rounded-full bg-emergency blink-alert" />
                    FAOL
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">O&apos;CHIQ</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !emergencyMode;
              setEmergencyMode(next);
              setEmergencyLog(prev => [{
                action: next ? 'Favqulodda rejim faollashtirildi' : 'Favqulodda rejim o\'chirildi',
                time: new Date().toLocaleTimeString(),
              }, ...prev]);
            }}
            className={cn('relative w-14 h-7 rounded-full transition-colors', emergencyMode ? 'bg-emergency' : 'bg-gray-300 dark:bg-gray-600')}
          >
            <div className={cn('absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform', emergencyMode ? 'translate-x-7' : 'translate-x-0')} />
          </button>
        </div>
        {emergencyLog.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/30">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Faoliyat Jurnali
            </p>
            <div className="space-y-1">
              {emergencyLog.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <span className="text-gray-700 dark:text-gray-300">{entry.action}</span>
                  <span className="text-gray-400">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('Total Emergency Alerts')} value={stats!.totalAlerts} icon={<AlertTriangle className="w-6 h-6" />} color="emergency" delay={0} />
          <StatCard title={t('Active Alerts')} value={stats!.activeAlerts} icon={<Activity className="w-6 h-6" />} color="emergency" delay={0.1} />
          <StatCard title={t('Resolved Today')} value={stats!.resolvedToday} icon={<CheckCircle2 className="w-6 h-6" />} color="secondary" delay={0.2} />
          <StatCard title={t('Avg Response Time')} value={stats!.avgResponseTime} icon={<Clock className="w-6 h-6" />} color="amber" delay={0.3} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-emergency" />
            {t('Active Alerts')}
            {activeAlerts.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emergency text-white">{activeAlerts.length}</span>
            )}
          </h3>
          {loading ? (
            <LoadingSkeleton type="table" />
          ) : activeAlerts.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#00C896]/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-[#00C896]" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('No Active Alerts')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('All emergencies are currently resolved.')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="emergency-card emergency-glow rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all"
                  onClick={() => router.push(`/emergency/profile/${alert.patientId}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emergency/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-emergency blink-alert" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.patientName}</p>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emergency text-white uppercase blink-alert">{t('Active')}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('Triggered by')}: {alert.triggeredBy}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emergency" /> {t('Blood')}: {alert.bloodType}</span>
                        {alert.allergies.length > 0 && (
                          <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-amber-500" /> {t('Allergies')}: {alert.allergies.join(', ')}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">{formatDateTime(alert.accessedAt)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emergency flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            {t('Recent Activity')}
          </h3>
          {loading ? (
            <LoadingSkeleton type="table" />
          ) : (
            <ChartCard title="">
              <div className="space-y-0">
                {activity.slice(0, 8).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 py-2.5 border-b last:border-b-0 border-gray-50 dark:border-gray-800/30"
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                      i < 3 ? 'bg-emergency/10 text-emergency' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400'
                    )}>
                      {i < 3 ? <Zap className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 dark:text-white truncate">{item.action}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.user}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  );
}
