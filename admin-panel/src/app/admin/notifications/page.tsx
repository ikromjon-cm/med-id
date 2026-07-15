'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, AlertTriangle, Bell, Info, Calendar, Clock } from 'lucide-react';
import Modal from '@/components/Modal';
import FormInput from '@/components/FormInput';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { getNotifications, createNotification, getUsers } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import type { Notification, User } from '@/lib/types';
import { t } from '@/lib/i18n';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Emergency: <AlertTriangle className="w-4 h-4" />,
  Alert: <Bell className="w-4 h-4" />,
  Update: <Info className="w-4 h-4" />,
  Reminder: <Calendar className="w-4 h-4" />,
};

const TYPE_COLORS: Record<string, string> = {
  Emergency: 'border-l-emergency',
  Alert: 'border-l-amber-500',
  Update: 'border-l-primary',
  Reminder: 'border-l-[#00C896]',
};

const TYPE_BG: Record<string, string> = {
  Emergency: 'bg-emergency/5',
  Alert: 'bg-amber-50/50 ',
  Update: 'bg-primary/5',
  Reminder: 'bg-[#00C896]/5',
};

const NOTIF_TYPES = [
  { value: 'Alert', label: t('Alert') },
  { value: 'Reminder', label: t('Reminder') },
  { value: 'Update', label: t('Update') },
  { value: 'Emergency', label: t('Emergency') },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Alert' as Notification['type'], title: '', message: '', recipients: [] as string[], recipientType: 'all' as 'all' | 'select' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [n, u] = await Promise.all([getNotifications(), getUsers()]);
    setNotifications(n);
    setUsers(u);
    setLoading(false);
  }, []);

  useEffect(() => { queueMicrotask(() => load()); }, [load]);

  const openCreate = () => {
    setForm({ type: 'Alert', title: '', message: '', recipients: [], recipientType: 'all' });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = t('Title is required');
    if (!form.message.trim()) errors.message = t('Message is required');
    if (form.recipientType === 'select' && form.recipients.length === 0) errors.recipients = t('Select at least one recipient');
    return errors;
  };

  const handleSend = async () => {
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      await createNotification({
        type: form.type,
        title: form.title,
        message: form.message,
        recipients: form.recipientType === 'all' ? ['all'] : form.recipients,
      });
      await load();
      setModalOpen(false);
    } catch {}
    setSaving(false);
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 ">{t('Notifications')}</h2>
          <p className="text-sm text-gray-500  mt-1">{t('Send and manage system notifications')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          {t('Send Notification')}
        </motion.button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title={t('No notifications')}
          description={t('No notifications have been sent yet.')}
          action={{ label: t('Send Notification'), onClick: openCreate }}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card rounded-2xl p-5 border-l-4 ${TYPE_COLORS[n.type]} ${TYPE_BG[n.type]}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white  flex items-center justify-center shadow-sm flex-shrink-0">
                  {TYPE_ICONS[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 ">{n.title}</h3>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white  text-gray-500 ">{n.type}</span>
                    </div>
                    <StatusBadge status={n.status} />
                  </div>
                  <p className="text-sm text-gray-600  mt-2">{n.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 ">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDateTime(n.createdAt)}</span>
                    <span>{n.recipients.length === 1 && n.recipients[0] === 'all' ? t('All users') : `${n.recipients.length} ${n.recipients.length > 1 ? t('recipients') : t('recipient')}`}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('Send Notification')}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600  hover:bg-gray-100  rounded-xl transition-colors">{t('Cancel')}</button>
            <button onClick={handleSend} disabled={saving} className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <Send className="w-4 h-4" />
              {t('Send')}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label={t('Type')} as="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Notification['type'] })} options={NOTIF_TYPES} />
          <FormInput label={t('Title')} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} error={formErrors.title} placeholder={t('Notification title')} />
          <FormInput label={t('Message')} as="textarea" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} error={formErrors.message} placeholder={t('Enter notification message...')} />

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">{t('Recipients')}</label>
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setForm({ ...form, recipientType: 'all', recipients: [] })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${form.recipientType === 'all' ? 'bg-primary text-white' : 'bg-gray-100  text-gray-600 '}`}
              >
                {t('All Users')}
              </button>
              <button
                onClick={() => setForm({ ...form, recipientType: 'select' })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${form.recipientType === 'select' ? 'bg-primary text-white' : 'bg-gray-100  text-gray-600 '}`}
              >
                {t('Select Users')}
              </button>
            </div>
            {form.recipientType === 'select' && (
              <div className="max-h-32 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-gray-50  border border-gray-100 ">
                {users.slice(0, 10).map(u => (
                  <label key={u.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.recipients.includes(u.email)}
                      onChange={e => {
                        if (e.target.checked) setForm({ ...form, recipients: [...form.recipients, u.email] });
                        else setForm({ ...form, recipients: form.recipients.filter(r => r !== u.email) });
                      }}
                      className="rounded border-gray-300  text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm text-gray-700 ">{u.name} ({u.email})</span>
                  </label>
                ))}
              </div>
            )}
            {formErrors.recipients && <p className="text-xs text-emergency mt-1">{formErrors.recipients}</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
