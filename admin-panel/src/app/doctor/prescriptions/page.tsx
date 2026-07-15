'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import DataTable from '@/components/DataTable';
import ErrorState from '@/components/ErrorState';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import { getDoctorPrescriptions, createPrescription } from '@/lib/mockData';
import type { Prescription, TableColumn } from '@/lib/types';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

const DOCTOR_ID = 'DOC-001';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({ patientName: '', medication: '', dosage: '', frequency: '', startDate: '', endDate: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const p = await getDoctorPrescriptions(DOCTOR_ID);
      setPrescriptions(p);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const handleCreate = async () => {
    if (!formData.medication.trim() || !formData.dosage.trim() || !formData.patientName.trim()) return;
    const p = await createPrescription({
      patientId: `PAT-${Date.now()}`,
      patientName: formData.patientName,
      doctorId: DOCTOR_ID,
      medication: formData.medication,
      dosage: formData.dosage,
      frequency: formData.frequency,
      startDate: formData.startDate || new Date().toISOString(),
      endDate: formData.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'active',
    });
    setPrescriptions(prev => [p, ...prev]);
    setCreateModal(false);
    setFormData({ patientName: '', medication: '', dosage: '', frequency: '', startDate: '', endDate: '' });
  };

  const columns: TableColumn<Prescription>[] = [
    { key: 'medication', header: t('Medication'), sortable: true },
    {
      key: 'dosage', header: t('Dosage'), sortable: true,
      render: (p: Prescription) => <span className="font-medium text-gray-900 ">{p.dosage}</span>,
    },
    { key: 'frequency', header: t('Frequency'), sortable: true },
    { key: 'patientName', header: t('Patient'), sortable: true },
    {
      key: 'startDate', header: t('Start'), sortable: true,
      render: (p: Prescription) => <span className="text-gray-500 ">{formatDate(p.startDate)}</span>,
    },
    {
      key: 'status', header: t('Status'), sortable: true,
      render: (p: Prescription) => <StatusBadge status={p.status} />,
    },
  ];

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 ">{t('Prescriptions')}</h2>
          <p className="text-sm text-gray-500  mt-1">{t('Manage your prescriptions')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/20"
        >
          <Plus className="w-4 h-4" />
          {t('New Prescription')}
        </motion.button>
      </div>

      <DataTable
        data={prescriptions}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchable
        searchPlaceholder={t('Search prescriptions...')}
        loading={loading}
        emptyTitle={t('No prescriptions')}
        emptyDescription={t("You haven't created any prescriptions yet.")}
        onEmptyAction={!loading ? { label: t('Create Prescription'), onClick: () => setCreateModal(true) } : undefined}
      />

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title={t('New Prescription')} size="md"
        footer={
          <>
            <button onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600  hover:bg-gray-100  rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleCreate} disabled={!formData.medication.trim() || !formData.dosage.trim() || !formData.patientName.trim()} className="px-4 py-2 text-sm font-medium bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed">{t('Save')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">{t('Patient Name *')}</label>
            <input type="text" value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Patient name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('Medication *')}</label>
              <input type="text" value={formData.medication} onChange={e => setFormData(p => ({ ...p, medication: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Medication name')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('Dosage *')}</label>
              <input type="text" value={formData.dosage} onChange={e => setFormData(p => ({ ...p, dosage: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('e.g. 500mg')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">{t('Frequency')}</label>
            <select value={formData.frequency} onChange={e => setFormData(p => ({ ...p, frequency: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option value="">{t('Select')}</option>
              <option value="Once daily">{t('Once daily')}</option>
              <option value="Twice daily">{t('Twice daily')}</option>
              <option value="Three times daily">{t('Three times daily')}</option>
              <option value="Every 6 hours">{t('Every 6 hours')}</option>
              <option value="As needed">{t('As needed')}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('Start Date')}</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">{t('End Date')}</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
