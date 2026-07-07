'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users, UserPlus, Trash2, Mail, Phone, Calendar
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import StatusBadge from '@/components/StatusBadge';
import RoleBadge from '@/components/RoleBadge';
import { getClinicStaff, addClinicStaff, removeClinicStaff } from '@/lib/mockData';
import type { ClinicEmployee } from '@/lib/types';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

const CLINIC_ID = 'CLN-001';

export default function StaffPage() {
  const [staff, setStaff] = useState<ClinicEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'receptionist' as ClinicEmployee['role'] });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const s = await getClinicStaff(CLINIC_ID);
      setStaff(s);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    const emp = await addClinicStaff(CLINIC_ID, {
      ...formData,
      clinicId: CLINIC_ID,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    setStaff(prev => [emp, ...prev]);
    setAddModal(false);
    setFormData({ name: '', email: '', phone: '', role: 'receptionist' });
  };

  const handleRemove = async (id: string) => {
    await removeClinicStaff(CLINIC_ID, id);
    setStaff(prev => prev.filter(e => e.id !== id));
  };

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Staff Management')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Manage clinic employees')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-4 h-4" />
          {t('Add Staff')}
        </motion.button>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : staff.length === 0 ? (
        <EmptyState title={t('No staff members')} description={t('Add staff to manage your clinic operations.')} action={{ label: t('Add Staff'), onClick: () => setAddModal(true) }} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800/30">
            {staff.map((emp, idx) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <div className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0',
                  emp.role === 'nurse' ? 'bg-[#00C896]/10 text-[#00C896]' :
                  emp.role === 'administrator' ? 'bg-primary/10 text-primary' :
                  emp.role === 'technician' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-500' :
                  'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                )}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{emp.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <RoleBadge role={emp.role} />
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{emp.email}</span>
                    {emp.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{emp.phone}</span>}
                  </div>
                </div>
                <StatusBadge status={emp.status} />
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-3 h-3" />
                  {formatDate(emp.createdAt)}
                </span>
                <button
                  onClick={() => handleRemove(emp.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emergency hover:bg-emergency/10 transition-all"
                  title={t('Remove')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={t('Add Staff Member')} size="md"
        footer={
          <>
            <button onClick={() => setAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">{t('Cancel')}</button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">{t('Add Staff')}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Name *')}</label>
            <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('Full name')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Email *')}</label>
            <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('email@clinic.com')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Phone')}</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('+1 (555) 000-0000')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Role')}</label>
            <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value as ClinicEmployee['role'] }))} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option value="receptionist">{t('Receptionist')}</option>
              <option value="nurse">{t('Nurse')}</option>
              <option value="administrator">{t('Administrator')}</option>
              <option value="technician">{t('Technician')}</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
