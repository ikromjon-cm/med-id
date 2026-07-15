'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  User, Mail, Phone, Calendar, Heart, Weight,
  Ruler, AlertCircle, Plus, X, ShieldCheck,
  Fingerprint,
  CheckCircle2, Hash, VenusAndMars
} from 'lucide-react';
import {
  getPatientProfile, updatePatientProfile
} from '@/lib/mockData';
import type { PatientProfile } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function ProfilePage() {
  const [profile, setProfile] = useState<PatientProfile | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Partial<PatientProfile>>({});
  const patientId = 'PAT-001';

  const [newAllergy, setNewAllergy] = useState('');
  const [newDisease, setNewDisease] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    async function load() {
      const p = await getPatientProfile(patientId);
      setProfile(p);
      if (p) {
        setForm({
          name: p.name,
          email: p.email,
          phone: p.phone,
          dateOfBirth: p.dateOfBirth,
          gender: p.gender,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const updated = await updatePatientProfile(patientId, form);
    if (updated) {
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const addTag = (field: 'allergies' | 'chronicDiseases' | 'medications', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const updated = { ...form, [field]: [...(profile?.[field] || []), value.trim()] };
    setForm(updated);
    setter('');
    setProfile(prev => prev ? { ...prev, ...updated } : prev);
  };

  const removeTag = (field: 'allergies' | 'chronicDiseases' | 'medications', index: number) => {
    const arr = [...(profile?.[field] || [])];
    arr.splice(index, 1);
    const updated = { ...form, [field]: arr };
    setForm(updated);
    setProfile(prev => prev ? { ...prev, ...updated } : prev);
  };

  const toggleBiometric = async () => {
    const newVal = !profile?.biometricEnabled;
    const updated = await updatePatientProfile(patientId, { biometricEnabled: newVal });
    if (updated) setProfile(updated);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-5 w-40 bg-gray-200  rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(j => (
                <div key={j}>
                  <div className="h-3 w-20 bg-gray-200  rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200  rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500">{t('Profile not found')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 ">{profile.name}</h2>
              <p className="text-sm text-gray-500 ">{t('Patient ID')}: {profile.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
              >
                <CheckCircle2 className="w-3 h-3" />
                {t('Saved')}
              </motion.span>
            )}
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              profile.biometricEnabled
                ? 'bg-secondary/10 text-secondary'
                : 'bg-gray-100  text-gray-500'
            )}>
              {profile.biometricEnabled ? t('Biometric ON') : t('Biometric OFF')}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold text-gray-900 ">{t('Personal Information')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: t('Full Name'), value: form.name, key: 'name', icon: User },
            { label: t('Email'), value: form.email, key: 'email', icon: Mail, type: 'email' },
            { label: t('Phone'), value: form.phone, key: 'phone', icon: Phone, type: 'tel' },
            { label: t('Date of Birth'), value: form.dateOfBirth, key: 'dateOfBirth', icon: Calendar, type: 'date' },
            { label: t('Gender'), value: form.gender, key: 'gender', icon: VenusAndMars, as: 'select', options: [t('Male'), t('Female')] },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-500  mb-1.5 flex items-center gap-1.5">
                <field.icon className="w-3 h-3" />
                {field.label}
              </label>
              {field.as === 'select' ? (
                <select
                  value={form[field.key as keyof typeof form] as string || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80  border border-gray-200  text-gray-900  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={field.value || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/80  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Heart className="w-4 h-4 text-rose-500" />
          <h3 className="text-base font-semibold text-gray-900 ">{t('Medical Information')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t('Blood Type'), value: profile.bloodType, icon: Heart, color: 'text-emergency' },
            { label: t('Height'), value: profile.height, icon: Ruler, color: 'text-primary' },
            { label: t('Weight'), value: profile.weight, icon: Weight, color: 'text-secondary' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-gray-50  border border-gray-100 ">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon className={cn('w-4 h-4', item.color)} />
                  <span className="text-xs text-gray-500 ">{item.label}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-lg font-bold text-gray-900 ">{item.value}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3" />
                {t('Verified by MED-ID')}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {(['allergies', 'chronicDiseases', 'medications'] as const).map((field, idx) => {
        const labels = { allergies: t('Allergies'), chronicDiseases: t('Chronic Diseases'), medications: t('Current Medications') };
        const icons = { allergies: AlertCircle, chronicDiseases: Heart, medications: Hash };
        const setters = { allergies: setNewAllergy, chronicDiseases: setNewDisease, medications: setNewMedication };
        const states = { allergies: newAllergy, chronicDiseases: newDisease, medications: newMedication };
        const colors = { allergies: 'text-rose-500', chronicDiseases: 'text-amber-500', medications: 'text-primary' };
        const Icon = icons[field];
        const items = profile[field] || [];

        return (
          <motion.div
            key={field}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className={cn('w-4 h-4', colors[field])} />
              <h3 className="text-base font-semibold text-gray-900 ">{labels[field]}</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {items.length === 0 ? (
                <p className="text-sm text-gray-400  italic">{field === 'medications' ? t('No medications listed') : field === 'allergies' ? t('No allergies listed') : t('No chronicDiseases listed')}</p>
              ) : (
                items.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100  text-gray-700  border border-gray-200 "
                  >
                    {item}
                    <button
                      onClick={() => removeTag(field, i)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-200  transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={states[field]}
                onChange={(e) => setters[field](e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addTag(field, states[field], setters[field]);
                  }
                }}
                placeholder={t('Add') + '...'}
                className="flex-1 px-4 py-2 rounded-xl text-sm bg-white/80  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={() => addTag(field, states[field], setters[field])}
                className="px-3 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                {t('Add')}
              </button>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Fingerprint className="w-4 h-4 text-secondary" />
          <h3 className="text-base font-semibold text-gray-900 ">{t('Biometric Status')}</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50  border border-gray-100 ">
          <div>
            <p className="text-sm font-medium text-gray-900 ">{t('Biometric Authentication')}</p>
            <p className="text-xs text-gray-500  mt-0.5">
              {profile.biometricEnabled
                ? t('Your fingerprint / face ID is active')
                : t('Enable for faster and secure access')}
            </p>
          </div>
          <button
            onClick={toggleBiometric}
            className={cn(
              'relative w-14 h-7 rounded-full transition-colors duration-300',
              profile.biometricEnabled ? 'bg-secondary' : 'bg-gray-300 '
            )}
          >
            <motion.div
              animate={{ x: profile.biometricEnabled ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 disabled:opacity-50"
        >
          {saving ? t('Saving') + '...' : t('Save Changes')}
        </button>
      </div>
    </div>
  );
}
