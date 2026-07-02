'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, List, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EmergencyStats from '@/components/EmergencyStats';
import EmergencyBadge from '@/components/EmergencyBadge';
import EmergencyAlertCard from '@/components/EmergencyAlertCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import ChartCard from '@/components/ChartCard';
import { getEmergencyAlerts, resolveEmergencyAlert, emergencyAlerts, emergencyAccessLogs } from '@/lib/mockData';
import type { EmergencyAlert } from '@/lib/types';

export default function EmergencyDashboardPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [logs, setLogs] = useState(typeof emergencyAccessLogs !== 'undefined' ? emergencyAccessLogs : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = getEmergencyAlerts();
      setAlerts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleResolve = (id: string) => {
    resolveEmergencyAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a));
  };

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const resolvedToday = alerts.filter(a => a.status === 'RESOLVED' && a.resolvedAt && new Date(a.resolvedAt).toDateString() === new Date().toDateString());

  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Management</h2>
            <EmergencyBadge count={activeAlerts.length} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage emergency alerts and access</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/alerts')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emergency text-white text-sm font-medium hover:bg-emergency-dark transition-all shadow-lg shadow-emergency/20"
          >
            <Bell className="w-4 h-4" />
            View All Alerts
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/logs')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <List className="w-4 h-4" />
            Access Logs
          </motion.button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <EmergencyStats
          activeAlerts={activeAlerts.length}
          resolvedToday={resolvedToday.length}
          avgResponseTime="12 min"
          totalAlerts={alerts.length}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Active Emergency Alerts" subtitle={`${activeAlerts.length} currently active`} className="emergency-card">
          {loading ? (
            <LoadingSkeleton type="table" />
          ) : activeAlerts.length === 0 ? (
            <EmptyState title="No active alerts" description="All emergencies have been resolved." />
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert, i) => (
                <EmergencyAlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolve}
                  onViewProfile={(patientId) => {}}
                  delay={i * 0.05}
                />
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Recent Emergency Access" subtitle="Latest emergency access logs">
          {loading ? (
            <LoadingSkeleton type="table" />
          ) : logs.length === 0 ? (
            <EmptyState title="No access logs" description="No emergency access recorded." />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.slice(0, 10).map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-emergency flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{log.patientName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by {log.accessedBy} · {log.accessType}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    log.status === 'GRANTED' ? 'bg-[#00C896]/10 text-[#00C896]' :
                    log.status === 'DENIED' ? 'bg-emergency/10 text-emergency' :
                    'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                  }`}>{log.status}</span>
                </motion.div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Emergency management tools</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/alerts')}
            className="emergency-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <Bell className="w-6 h-6 text-emergency mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">View All Emergencies</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">See all active emergency alerts</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/logs')}
            className="glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <List className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Access Logs</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Review emergency access history</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Emergency Protocols</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View standard operating procedures</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <ExternalLink className="w-6 h-6 text-[#00C896] mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">System Health</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Check system and service status</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
