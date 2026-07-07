'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Plus, Calendar, User } from 'lucide-react';
import DataTable from '@/components/DataTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import Modal from '@/components/Modal';
import { getDoctorDiagnoses, createDiagnosis } from '@/lib/mockData';
import type { Diagnosis, TableColumn } from '@/lib/types';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

const DOCTOR_ID = 'DOC-001';

export default function DiagnosesPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', patientName: '', condition: '', notes: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const d = await getDoctorDiagnoses(DOCTOR_ID);
      setDiagnoses(d);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async () => {
    if (!formData.condition.trim() || !formData.patientName.trim()) return;
    const d = await createDiagnosis({
      patientId: formData.patientId || `PAT-${Date.now()}`,
      patientName: formData.patientName,
      doctorId: DOCTOR_ID,
      doctorName: 'Dr. James Wilson',
      condition: formData.condition,
      notes: formData.notes,
      date: new Date().toISOString(),
    });
    setDiagnoses(prev => [d, ...prev]);
    setCreateModal(false);
    setFormData({ patientId: '', patientName: '', condition: '', notes: '' });
  };

  const columns: TableColumn<Diagnosis>[] = [
    { key: 'condition', header: t('Condition'), sortable: true },
    { key: 'patientName', header: t('Patient'), sortable: true },
    {
      key: 'date', header: t('Date'), sortable: true,
      render: (d: Diagnosis) => (
        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Calendar className="w-3.5 h-3.5" /> {formatDate(d.date)}
        </span>
      ),
    },
    {
      key: 'notes', header: t('Notes'), sortable: false,
      render: (d: Diagnosis) => <span className="text-gray-500 dark:text-gray-400 truncate max-w-[250px] inline-block">{d.notes}</span>,
    },
  ];

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Diagnoses')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Your diagnosis history')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {t('New Diagnosis')}
        </motion.button>
      </div>

      <DataTable
        data={diagnoses}
        columns={columns}
        keyExtractor={(d) => d.id}
        searchable
        searchPlaceholder={t('Search diagnoses...')}
        loading={loading}
        emptyTitle={t('No diagnoses recorded')}
        emptyDescription={t("You haven't recorded any diagnoses yet.")}
        onEmptyAction={!loading ? { label: t('Create Diagnosis'), onClick: () => setCreateModal(true) } : undefined}
      />

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title={t('New Diagnosis')} size="md"
        footer={
          <>
            <button onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleCreate} disabled={!formData.condition.trim() || !formData.patientName.trim()} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">{t('Save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Patient Name *')}</label>
            <input type="text" value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Patient name')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Condition *')}</label>
            <input type="text" value={formData.condition} onChange={e => setFormData(p => ({ ...p, condition: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Diagnosed condition')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Notes')}</label>
            <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder={t('Additional notes...')} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
