'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  User, Clock, Download,
  CheckCircle2, XCircle, AlertCircle, Search
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { emergencyAccessLogs } from '@/lib/mockData';
import type { EmergencyAccessLog } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { t } from '@/lib/i18n';

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  GRANTED: {
    color: 'text-[#00C896]',
    bg: 'bg-[#00C896]/10',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: t('Granted'),
  },
  DENIED: {
    color: 'text-emergency',
    bg: 'bg-emergency/10',
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: t('Denied'),
  },
  PENDING: {
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: t('Pending'),
  },
};

export default function LogsPage() {
  const [logs, setLogs] = useState<EmergencyAccessLog[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setLogs(emergencyAccessLogs);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const filtered = logs.filter(l => {
    const matchesSearch = l.patientName.toLowerCase().includes(search.toLowerCase()) ||
      l.accessedBy.toLowerCase().includes(search.toLowerCase()) ||
      l.accessType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csv = [
      [t('Patient'), t('Accessed By'), t('Access Type'), t('Timestamp'), t('Status')].join(','),
      ...filtered.map(l =>
        [l.patientName, l.accessedBy, l.accessType, l.timestamp, l.status].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emergency-access-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Emergency Access Logs')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Full history of emergency access events')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-4 h-4" />
          {t('Export CSV')}
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('Search by patient, staff, or type...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'GRANTED', 'DENIED', 'PENDING'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                statusFilter === s
                  ? s === 'GRANTED' ? 'bg-[#00C896] text-white' :
                    s === 'DENIED' ? 'bg-emergency text-white' :
                    s === 'PENDING' ? 'bg-amber-500 text-white' :
                    'bg-primary text-white'
                  : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              )}
            >
              {s === 'ALL' ? t('All') : s === 'GRANTED' ? t('Granted') : s === 'DENIED' ? t('Denied') : t('Pending')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('No logs found')} description={search || statusFilter !== 'ALL' ? t('Try adjusting your filters.') : t('No emergency access events recorded yet.')} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Patient')}</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Accessed By')}</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Access Type')}</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Timestamp')}</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
                {filtered.map((log, idx) => {
                  const sc = statusConfig[log.status] || statusConfig.PENDING;
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{log.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">{log.accessedBy}</td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{log.accessType}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDateTime(log.timestamp)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full', sc.bg, sc.color)}>
                          {sc.icon}
                          {sc.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">{filtered.length} {t('log entry')}{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}
    </div>
  );
}
