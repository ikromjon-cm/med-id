'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Droplets, ShieldAlert,
  Pill, Phone, Heart, Zap, Clock, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { getPatientProfile } from '@/lib/mockData';
import type { PatientProfile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

export default function EmergencyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [accessLogged, setAccessLogged] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const p = await getPatientProfile(patientId);
      setProfile(p || null);
      setTimeout(() => setAccessLogged(true), 500);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('Back')}
      </motion.button>

      {accessLogged && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
        >
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{t('Access Logged')}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">{t('This emergency access has been recorded and the patient will be notified.')}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 ml-auto" />
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700/50" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700/50 rounded" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700/50 rounded" />
              </div>
            </div>
          </div>
          <LoadingSkeleton type="card" count={3} />
        </div>
      ) : !profile ? (
        <ErrorState title={t('Patient not found')} description={t('No patient found with this ID.')} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border-l-4 border-l-emergency"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emergency/10 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-emergency" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{profile.gender}</span>
                  <span>{t('Date of Birth')}: {formatDate(profile.dateOfBirth)}</span>
                  <span>{profile.id}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emergency" />
                {t('Vital Information')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-emergency/5 border border-emergency/10">
                  <div className="w-12 h-12 rounded-xl bg-emergency/10 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-emergency" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('Blood Type')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.bloodType}</p>
                  </div>
                </div>
                {profile.height && profile.weight && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('Height')}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile.height}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('Weight')}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile.weight}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                {t('Allergies')}
              </h3>
              {profile.allergies.length === 0 ? (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-[#00C896]/10 text-[#00C896] text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('No known allergies')}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-emergency/10 text-emergency text-sm font-medium flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {allergy}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                {t('Chronic Diseases')}
              </h3>
              {profile.chronicDiseases.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('No chronic diseases recorded.')}</p>
              ) : (
                <ul className="space-y-2">
                  {profile.chronicDiseases.map((disease, i) => (
                    <li key={i} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-gray-900 dark:text-white">{disease}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Pill className="w-4 h-4 text-secondary" />
                {t('Current Medications')}
              </h3>
              {profile.medications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('No medications recorded.')}</p>
              ) : (
                <ul className="space-y-2">
                  {profile.medications.map((med, i) => (
                    <li key={i} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                      <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{med}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
                {t('Emergency Contacts')}
            </h3>
            {profile.emergencyContacts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('No emergency contacts recorded.')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.emergencyContacts.map((contact) => (
                  <div key={contact.id} className={cn(
                    'p-4 rounded-xl',
                    contact.isPrimary ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20' : 'bg-gray-50 dark:bg-gray-800/30'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">{t('Primary')}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{contact.relationship}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{contact.phone}</p>
                    {contact.email && <p className="text-xs text-gray-500 dark:text-gray-400">{contact.email}</p>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
