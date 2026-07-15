'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import EmergencyAlertCard from '@/components/EmergencyAlertCard';
import EmergencyBadge from '@/components/EmergencyBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { getEmergencyAlerts, resolveEmergencyAlert } from '@/lib/mockData';
import type { EmergencyAlert } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function EmergencyAlertsPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

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

  useEffect(() => { queueMicrotask(() => load()); }, [load]);

  const handleResolve = (id: string) => {
    resolveEmergencyAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a));
  };

  const filteredAlerts = showResolved ? alerts : alerts.filter(a => a.status === 'ACTIVE');
  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;

  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/emergency" className="text-gray-400 hover:text-gray-600  transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 ">{t('Active Alerts')}</h2>
            <EmergencyBadge count={activeCount} />
          </div>
          <p className="text-sm text-gray-500  mt-1 ml-9">{t('Monitor and manage emergency alerts')}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t('Refresh')}
          </motion.button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowResolved(false)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !showResolved ? 'bg-emergency text-white shadow-lg shadow-emergency/20' : 'bg-gray-100  text-gray-600  hover:bg-gray-200 '
          }`}
        >
          <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> {t('Active')} ({activeCount})</span>
        </button>
        <button
          onClick={() => setShowResolved(true)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showResolved ? 'bg-emergency text-white shadow-lg shadow-emergency/20' : 'bg-gray-100  text-gray-600  hover:bg-gray-200 '
          }`}
        >
          {t('All Alerts')} ({alerts.length})
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : filteredAlerts.length === 0 ? (
        <EmptyState
          title={t('No alerts to display')}
          description={showResolved ? t('There are no emergency alerts.') : t('All emergencies have been resolved.')}
          action={showResolved ? undefined : { label: t('Show All'), onClick: () => setShowResolved(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAlerts.map((alert, i) => (
            <EmergencyAlertCard
              key={alert.id}
              alert={alert}
              onResolve={handleResolve}
              onViewProfile={() => {}}
              delay={i * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
}
