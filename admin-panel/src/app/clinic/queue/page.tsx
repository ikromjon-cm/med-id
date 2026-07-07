'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  UserPlus, Clock, Phone, CheckCircle2, Stethoscope,
  AlertTriangle
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import {
  getClinicQueue, updateQueueEntry, addToQueue
} from '@/lib/mockData';
import { t } from '@/lib/i18n';
import type { QueueEntry } from '@/lib/types';

const CLINIC_ID = 'CLN-001';

const priorityColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  LOW: { bg: 'bg-[#00C896]/10', text: 'text-[#00C896]', dot: 'bg-[#00C896]', label: 'Low' },
  MEDIUM: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500', label: 'Medium' },
  HIGH: { bg: 'bg-emergency/10', text: 'text-emergency', dot: 'bg-emergency', label: 'High' },
  CRITICAL: { bg: 'bg-emergency/10', text: 'text-emergency', dot: 'bg-emergency pulse-dot', label: 'Critical' },
};

const statusStyles: Record<string, string> = {
  WAITING: 'text-amber-500',
  WITH_DOCTOR: 'text-primary',
  COMPLETED: 'text-[#00C896]',
};

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', patientName: '', priority: 'MEDIUM' as QueueEntry['priority'] });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const q = await Promise.resolve(getClinicQueue(CLINIC_ID));
      setQueue(q);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const filtered = filter === 'ALL' ? queue : queue.filter(e => e.status === filter);

  const handleCallPatient = async (id: string) => {
    await updateQueueEntry(id, { status: 'WITH_DOCTOR' });
    setQueue(prev => prev.map(e => e.id === id ? { ...e, status: 'WITH_DOCTOR' } : e));
  };

  const handleComplete = async (id: string) => {
    await updateQueueEntry(id, { status: 'COMPLETED' });
    setQueue(prev => prev.map(e => e.id === id ? { ...e, status: 'COMPLETED' } : e));
  };

  const handleAddToQueue = async () => {
    if (!formData.patientName.trim()) return;
    const entry = await addToQueue({
      clinicId: CLINIC_ID,
      patientId: formData.patientId || `PAT-${Date.now()}`,
      patientName: formData.patientName,
      priority: formData.priority,
      status: 'WAITING',
      waitTimeMinutes: 0,
      joinedAt: new Date().toISOString(),
    });
    setQueue(prev => [entry, ...prev]);
    setAddModalOpen(false);
    setFormData({ patientId: '', patientName: '', priority: 'MEDIUM' });
  };

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Queue Management')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Manage patient queue and priorities')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-4 h-4" />
          {t('Add to Queue')}
        </motion.button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {['ALL', 'WAITING', 'WITH_DOCTOR', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === status
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            )}
          >
            {status === 'ALL' ? t('All') : t(status.replace('_', ' '))}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('Queue is empty')} description={t('No patients in the queue. Add patients to get started.')} action={{ label: t('Add Patient'), onClick: () => setAddModalOpen(true) }} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800/30">
            {filtered.map((entry, idx) => {
              const pc = priorityColors[entry.priority];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={cn(
                    'flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/20',
                    entry.priority === 'CRITICAL' && 'emergency-card emergency-glow'
                  )}
                >
                  <div className={cn('w-3 h-3 rounded-full flex-shrink-0', pc.dot)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.patientName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className={cn('capitalize font-medium', statusStyles[entry.status])}>
                        {t(entry.status.replace('_', ' '))}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.waitTimeMinutes} min
                      </span>
                      <span>ID: {entry.id}</span>
                    </div>
                  </div>
                  <span className={cn('px-2.5 py-1 text-[10px] font-semibold rounded-full flex items-center gap-1', pc.bg, pc.text)}>
                    {entry.priority === 'CRITICAL' && <AlertTriangle className="w-2.5 h-2.5 blink-alert" />}
                    {t(pc.label)}
                  </span>
                  <div className="flex items-center gap-1">
                    {entry.status === 'WAITING' && (
                      <>
                        <button onClick={() => handleCallPatient(entry.id)} title={t('Call Patient')} className="w-9 h-9 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleComplete(entry.id)} title={t('With Doctor')} className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all">
                          <Stethoscope className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {entry.status !== 'COMPLETED' && (
                      <button onClick={() => handleComplete(entry.id)} title={t('Complete')} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#00C896] hover:bg-[#00C896]/10 transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title={t('Add to Queue')} size="md"
        footer={
          <>
            <button onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleAddToQueue} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">{t('Add to Queue')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Patient Name *')}</label>
            <input type="text" value={formData.patientName} onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))} placeholder={t('Enter patient name')} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Priority')}</label>
            <select value={formData.priority} onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as QueueEntry['priority'] }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option value="LOW">{t('Low')}</option>
              <option value="MEDIUM">{t('Medium')}</option>
              <option value="HIGH">{t('High')}</option>
              <option value="CRITICAL">{t('Critical')}</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
