'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, List, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EmergencyStats from '@/components/EmergencyStats';
import EmergencyBadge from '@/components/EmergencyBadge';
import EmergencyAlertCard from '@/components/EmergencyAlertCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import ChartCard from '@/components/ChartCard';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import { getEmergencyAlerts, resolveEmergencyAlert, emergencyAlerts, emergencyAccessLogs, getEmergencyStaffList } from '@/lib/mockData';
import type { EmergencyAlert, EmergencyStaff } from '@/lib/types';
import { t } from '@/lib/i18n';

const roleLabels: Record<string, string> = {
  paramedic: 'Paramedic',
  emergency_doctor: 'Emergency Doctor',
  emergency_nurse: 'Emergency Nurse',
  dispatcher: 'Dispatcher',
};

const statusVariants: Record<string, string> = {
  available: 'bg-[#00C896]/10 text-[#00C896]',
  on_duty: 'bg-primary/10 text-primary',
  off_duty: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
};

const roleUzLabels: Record<string, string> = {
  paramedic: 'Paramedik',
  emergency_doctor: 'Favqulodda Shifokor',
  emergency_nurse: 'Favqulodda Hamshira',
  dispatcher: 'Dispetcher',
};

const statusUzLabels: Record<string, string> = {
  available: 'Mavjud',
  on_duty: 'Navbatda',
  off_duty: 'Dam olishda',
};

export default function EmergencyDashboardPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [logs, setLogs] = useState(typeof emergencyAccessLogs !== 'undefined' ? emergencyAccessLogs : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [staffList, setStaffList] = useState<EmergencyStaff[]>([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: 'paramedic', clinic: '' });

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = getEmergencyAlerts();
      setAlerts(data);
      const staff = await getEmergencyStaffList();
      setStaffList(staff);
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Emergency Management')}</h2>
            <EmergencyBadge count={activeAlerts.length} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Monitor and manage emergency alerts and access')}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/alerts')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emergency text-white text-sm font-medium hover:bg-emergency-dark transition-all shadow-lg shadow-emergency/20"
          >
            <Bell className="w-4 h-4" />
            {t('View All Alerts')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/logs')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <List className="w-4 h-4" />
            {t('Access Logs')}
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

      {/* EMERGENCY STAFF */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Favqulodda Xodimlar')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('Emergency staff management')}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowStaffModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            {t("Yangi Xodim Qo'shish")}
          </motion.button>
        </div>
        {staffList.length === 0 ? (
          <EmptyState title={t('No staff found')} description={t('Add emergency staff to get started')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/50">
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Name')}</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Email')}</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Phone')}</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Role')}</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Status')}</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Clinic')}</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, i) => (
                  <motion.tr
                    key={staff.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{staff.name}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{staff.email}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{staff.phone}</td>
                    <td className="py-3 px-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {t(roleUzLabels[staff.role] || staff.role)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusVariants[staff.status] || 'bg-gray-100 text-gray-500'}`}>
                        {t(statusUzLabels[staff.status] || staff.status)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400">{staff.clinic}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => setStaffList(prev => prev.filter(s => s.id !== staff.id))}
                        className="inline-flex items-center gap-1 text-xs font-medium text-emergency hover:text-emergency-dark transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> {t("O'chirish")}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('Active Emergency Alerts')} subtitle={`${activeAlerts.length} ${t('currently active')}`} className="emergency-card">
          {loading ? (
            <LoadingSkeleton type="table" />
          ) : activeAlerts.length === 0 ? (
            <EmptyState title={t('No active alerts')} description={t('All emergencies have been resolved.')} />
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

        <ChartCard title={t('Recent Emergency Access')} subtitle={t('Latest emergency access logs')}>
          {loading ? (
            <LoadingSkeleton type="table" />
          ) : logs.length === 0 ? (
            <EmptyState title={t('No access logs')} description={t('No emergency access recorded.')} />
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
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('Quick Actions')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('Emergency management tools')}</p>
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
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('View All Emergencies')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('See all active emergency alerts')}</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/emergency/logs')}
            className="glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <List className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('Access Logs')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Review emergency access history')}</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('Emergency Protocols')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('View standard operating procedures')}</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-2xl p-4 text-left hover:shadow-lg transition-all"
          >
            <ExternalLink className="w-6 h-6 text-[#00C896] mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('System Health')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Check system and service status')}</p>
          </motion.button>
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      <Modal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        title={t("Yangi Xodim Qo'shish")}
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowStaffModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {t('Cancel')}
            </button>
            <button
              onClick={() => {
                if (newStaff.name && newStaff.email) {
                  const entry: EmergencyStaff = {
                    id: `ES-${String(staffList.length + 1).padStart(3, '0')}`,
                    ...newStaff,
                    status: 'available',
                    createdAt: new Date().toISOString().slice(0, 10),
                  } as EmergencyStaff;
                  setStaffList(prev => [entry, ...prev]);
                  setNewStaff({ name: '', email: '', phone: '', role: 'paramedic', clinic: '' });
                  setShowStaffModal(false);
                }
              }}
              disabled={!newStaff.name || !newStaff.email}
              className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {t('Save')}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label={t('Name')} placeholder={t('Enter full name')} value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
          <FormInput label={t('Email')} type="email" placeholder={t('Email Address')} value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
          <FormInput label={t('Phone')} placeholder={t('Phone Number')} value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} />
          <FormInput
            as="select"
            label={t('Role')}
            value={newStaff.role}
            onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
            options={[
              { value: 'paramedic', label: t('Paramedic') },
              { value: 'emergency_doctor', label: t('Emergency Doctor') },
              { value: 'emergency_nurse', label: t('Emergency Nurse') },
              { value: 'dispatcher', label: t('Dispatcher') },
            ]}
          />
          <FormInput label={t('Clinic')} placeholder={t('Clinic Name')} value={newStaff.clinic} onChange={e => setNewStaff({ ...newStaff, clinic: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
