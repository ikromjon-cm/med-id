'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Scan, Search, User, Droplets, ShieldAlert, AlertTriangle,
  Loader2, Zap, Camera, ArrowRight
} from 'lucide-react';
import { searchPatients } from '@/lib/mockData';
import type { Patient } from '@/lib/types';
import { t } from '@/lib/i18n';

export default function QRScannerPage() {
  const router = useRouter();
  const [manualId, setManualId] = useState('');
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');

  const handleLookup = useCallback(async () => {
    if (!manualId.trim()) return;
    setSearching(true);
    setError('');
    setPatient(null);
    try {
      const results = await searchPatients(manualId);
      if (results.length > 0) {
        setPatient(results[0]);
      } else {
        setError(t('No patient found with that MED-ID. Please try again.'));
      }
    } catch {
      setError(t('Search failed. Please try again.'));
    } finally {
      setSearching(false);
    }
  }, [manualId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('QR Scanner')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Scan patient MED-ID QR code for emergency access')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center"
        >
          <div className="relative w-64 h-64 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-6 overflow-hidden">
            <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-2xl" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-2xl" />
            <div className="absolute inset-4 border border-primary/10 rounded-xl flex items-center justify-center">
              <Camera className="w-16 h-16 text-primary/30" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{t('Position the QR code within the frame to scan. The camera will auto-detect MED-ID codes.')}</p>
          <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            {t('Camera Ready')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('Manual Entry')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t("Enter the patient's MED-ID number manually")}</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Enter MED-ID (e.g. PAT-001)')}
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLookup}
              disabled={!manualId.trim() || searching}
              className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t('Lookup')}
            </motion.button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-emergency/10 text-emergency text-sm mb-4">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {patient && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-emergency/20 p-5 emergency-card"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-emergency blink-alert" />
                <span className="text-xs font-bold text-emergency uppercase tracking-wide">{t('Emergency Access')}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emergency/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-emergency" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900 dark:text-white">{patient.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{patient.age} {t('yrs')}, {patient.gender}</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emergency" />{patient.bloodType}</span>
                    <span>{patient.id}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/emergency/profile/${patient.id}`)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emergency text-white text-xs font-bold hover:bg-emergency-dark transition-all shadow-lg shadow-emergency/30"
                >
                  {t('View Profile')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
