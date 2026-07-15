'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  AlertTriangle, Zap, ShieldAlert, Clock,
  CheckCircle2, ArrowRight
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { getEmergencyAlerts, resolveEmergencyAlert } from '@/lib/mockData';
import type { EmergencyAlert } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const a = await Promise.resolve(getEmergencyAlerts());
      setAlerts(a);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.status === filter);

  const handleResolve = (id: string) => {
    resolveEmergencyAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' as const, resolvedAt: new Date().toISOString() } : a));
  };

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 ">{t('Emergency Alerts')}</h2>
        <p className="text-sm text-gray-500  mt-1">{t('All emergency access alerts')}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === s
                ? s === 'ACTIVE' ? 'bg-emergency text-white shadow-lg shadow-emergency/30' :
                  s === 'RESOLVED' ? 'bg-[#00C896] text-white shadow-lg shadow-[#00C896]/20' :
                  'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/70  text-gray-600  hover:bg-gray-100 '
            )}
          >
            {s === 'ALL' ? t('All') : s === 'ACTIVE' ? t('Active') : t('Resolved')}
            <span className="ml-1.5 text-xs opacity-80">
              ({s === 'ALL' ? alerts.length : alerts.filter(a => a.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('No alerts found')}
          description={filter !== 'ALL' ? (filter === 'ACTIVE' ? t('No ACTIVE alerts.') : t('No RESOLVED alerts.')) : t('No emergency alerts recorded.')}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn(
                'rounded-2xl p-5 transition-all cursor-pointer hover:scale-[1.005]',
                alert.status === 'ACTIVE'
                  ? 'emergency-card emergency-glow'
                  : 'glass-card'
              )}
              onClick={() => router.push(`/emergency/profile/${alert.patientId}`)}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
                  alert.status === 'ACTIVE' ? 'bg-emergency/20' : 'bg-[#00C896]/10'
                )}>
                  {alert.status === 'ACTIVE'
                    ? <AlertTriangle className="w-6 h-6 text-emergency blink-alert" />
                    : <CheckCircle2 className="w-6 h-6 text-[#00C896]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 ">{alert.patientName}</h4>
                      <p className="text-xs text-gray-500 ">{t('Triggered by')}: {alert.triggeredBy}</p>
                    </div>
                    <span className={cn(
                      'px-3 py-1 text-[10px] font-bold rounded-full uppercase whitespace-nowrap',
                      alert.status === 'ACTIVE'
                        ? 'bg-emergency/10 text-emergency'
                        : 'bg-[#00C896]/10 text-[#00C896]'
                    )}>
                      {alert.status === 'ACTIVE' ? t('Active') : t('Resolved')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500  flex-wrap">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-emergency" /> {t('Blood')}: <strong>{alert.bloodType}</strong></span>
                    {alert.allergies.length > 0 && (
                      <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> {t('Allergies')}: {alert.allergies.join(', ')}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDateTime(alert.accessedAt)}</span>
                  </div>
                  {alert.resolvedAt && (
                    <p className="text-[10px] text-gray-400  mt-2">{t('Resolved at')}: {formatDateTime(alert.resolvedAt)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }}
                      className="px-4 py-2 rounded-xl bg-emergency text-white text-xs font-bold hover:bg-emergency-dark transition-all shadow-lg shadow-emergency/30"
                    >
                      {t('Resolve Alert')}
                    </button>
                  )}
                  <ArrowRight className={cn('w-4 h-4 flex-shrink-0', alert.status === 'ACTIVE' ? 'text-emergency' : 'text-gray-400')} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
