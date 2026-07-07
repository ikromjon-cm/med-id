'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Phone, Mail, User, Plus, Trash2, Edit3,
  AlertTriangle, Star, X, Shield, Heart
} from 'lucide-react';
import {
  getEmergencyContacts, addEmergencyContact,
  updateEmergencyContact, deleteEmergencyContact
} from '@/lib/mockData';
import type { EmergencyContact } from '@/lib/types';
import { t } from '@/lib/i18n';

const emptyForm = {
  name: '', relationship: '', phone: '', email: '', isPrimary: false,
};

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const patientId = 'PAT-001';

  useEffect(() => {
    async function load() {
      const c = await getEmergencyContacts(patientId);
      setContacts(c);
      setLoading(false);
    }
    load();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t('Name is required');
    if (!form.relationship.trim()) errs.relationship = t('Relationship is required');
    if (!form.phone.trim()) errs.phone = t('Phone is required');
    else if (!/^[\d\s\-+()]+$/.test(form.phone)) errs.phone = t('Invalid phone number');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('Invalid email');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (editId) {
      const updated = await updateEmergencyContact(patientId, editId, form);
      if (updated) {
        setContacts(prev => prev.map(c => c.id === editId ? updated : c));
      }
    } else {
      const created = await addEmergencyContact(patientId, form as Omit<EmergencyContact, 'id'>);
      setContacts(prev => [...prev, created]);
    }
    closeModal();
  };

  const handleEdit = (contact: EmergencyContact) => {
    setForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email,
      isPrimary: contact.isPrimary,
    });
    setEditId(contact.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await deleteEmergencyContact(patientId, id);
    setContacts(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
  };

  const handleMarkPrimary = async (id: string) => {
    const updated = await updateEmergencyContact(patientId, id, { isPrimary: true });
    if (updated) {
      setContacts(prev => prev.map(c => ({
        ...c,
        isPrimary: c.id === id,
      })));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700/50" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700/50 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('Emergency Contacts')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contacts.length} {t('contact')}{contacts.length !== 1 ? 's' : ''} - {t('contacts - these people will be notified in an emergency')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          {t('Add Contact')}
        </button>
      </motion.div>

      {contacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl"
        >
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('No emergency contacts')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
              {t('Add at least one emergency contact so that we can reach your loved ones in case of an emergency.')}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20"
            >
              {t('Add Contact')}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                'glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200',
                contact.isPrimary && 'border-emergency/20'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  contact.isPrimary
                    ? 'bg-gradient-to-br from-emergency to-rose-500 text-white shadow-md shadow-emergency/20'
                    : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                    {contact.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emergency/10 text-emergency border border-emergency/20">
                        <Star className="w-3 h-3 fill-current" />
                        {t('Primary')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="w-3.5 h-3.5" />
                      {contact.phone}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                      {contact.email || t('No email')}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                      <Shield className="w-3.5 h-3.5" />
                      {contact.relationship}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!contact.isPrimary && (
                    <button
                      onClick={() => handleMarkPrimary(contact.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                    >
                      <Star className="w-3 h-3 inline mr-1" />
                      {t('Set Primary')}
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(contact)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(contact.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-emergency hover:bg-emergency/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editId ? t('Edit Contact') : t('Add Emergency Contact')}
                </h3>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Full Name')}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      errors.name ? 'border-emergency focus:ring-emergency/20 focus:border-emergency' : 'border-gray-200 dark:border-gray-700/50'
                    )}
                    placeholder={t('Enter full name')}
                  />
                  {errors.name && <p className="text-xs text-emergency mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Relationship')}</label>
                  <input
                    type="text"
                    value={form.relationship}
                    onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      errors.relationship ? 'border-emergency focus:ring-emergency/20 focus:border-emergency' : 'border-gray-200 dark:border-gray-700/50'
                    )}
                    placeholder={t('e.g. Spouse, Brother, Parent')}
                  />
                  {errors.relationship && <p className="text-xs text-emergency mt-1">{errors.relationship}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Phone Number')}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      errors.phone ? 'border-emergency focus:ring-emergency/20 focus:border-emergency' : 'border-gray-200 dark:border-gray-700/50'
                    )}
                    placeholder={t('+1 (555) 000-0000')}
                  />
                  {errors.phone && <p className="text-xs text-emergency mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Email (optional)')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-gray-800/50 border text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      errors.email ? 'border-emergency focus:ring-emergency/20 focus:border-emergency' : 'border-gray-200 dark:border-gray-700/50'
                    )}
                    placeholder={t('email@example.com')}
                  />
                  {errors.email && <p className="text-xs text-emergency mt-1">{errors.email}</p>}
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPrimary}
                    onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('Set as primary emergency contact')}</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  {editId ? t('Save Changes') : t('Add Contact')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-emergency/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-emergency" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">{t('Delete Contact')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                {t('Are you sure you want to remove this emergency contact?')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-emergency text-white hover:bg-emergency-dark transition-colors"
                >
                  {t('Delete')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
