'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search, User, Droplets, Phone, Calendar, ChevronRight,
  Loader2, AlertCircle, Scan, Camera, Zap
} from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { searchPatients } from '@/lib/mockData';
import type { Patient } from '@/lib/types';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

export default function PatientSearchPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'search' | 'qr'>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);

  const [manualId, setManualId] = useState('');
  const [qrSearching, setQrSearching] = useState(false);
  const [qrPatient, setQrPatient] = useState<Patient | null>(null);
  const [qrError, setQrError] = useState('');

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(false);
    setSearched(true);
    try {
      const res = await searchPatients(query);
      setResults(res);
    } catch {
      setError(true);
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleQrLookup = useCallback(async () => {
    if (!manualId.trim()) return;
    setQrSearching(true);
    setQrError('');
    setQrPatient(null);
    try {
      const res = await searchPatients(manualId);
      if (res.length > 0) {
        setQrPatient(res[0]);
      } else {
        setQrError(t('No patient found with that MED-ID. Please try again.'));
      }
    } catch {
      setQrError(t('Search failed. Please try again.'));
    } finally {
      setQrSearching(false);
    }
  }, [manualId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Patient Search')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('Search by name, MED-ID, or phone number')}</p>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('search')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
            mode === 'search'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }`}
        >
          <Search className="w-4 h-4" />
          {t('Search')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('qr')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
            mode === 'qr'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }`}
        >
          <Scan className="w-4 h-4" />
          {t('QR Scanner')}
        </motion.button>
      </div>

      {mode === 'search' ? (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search by name, MED-ID, or phone...')}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={!query.trim() || searching}
              className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {searching ? t('Searching...') : t('Search')}
            </motion.button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-emergency/10 text-emergency text-sm">
              <AlertCircle className="w-4 h-4" />
              {t('Search failed. Please try again.')}
            </div>
          )}

          {searched && !searching && !error && (
            results.length === 0 ? (
              <EmptyState title={t('No patients found')} description={t('No results matching') + ` "${query}". ` + t('Try a different search term.')} />
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{results.length} {results.length !== 1 ? t('results found') : t('result found')}</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800/30">
                  {results.map((patient, idx) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                    >
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{patient.name}</p>
                          <StatusBadge status={patient.status} />
                          <span className="text-xs text-gray-400 dark:text-gray-500">{patient.id}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{patient.age} yrs, {patient.gender}</span>
                          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{patient.bloodType}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{patient.phone}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(patient.lastVisit)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          )}

          {!searched && !searching && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{t('Search Patients')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">{t('Enter a patient name, MED-ID, or phone number to find their profile.')}</p>
            </div>
          )}
        </>
      ) : (
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
                  onKeyDown={e => e.key === 'Enter' && handleQrLookup()}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQrLookup}
                disabled={!manualId.trim() || qrSearching}
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {qrSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {t('Search')}
              </motion.button>
            </div>

            {qrError && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-emergency/10 text-emergency text-sm mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {qrError}
              </div>
            )}

            {qrPatient && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-200 dark:border-gray-700/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{qrPatient.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{qrPatient.id}</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{qrPatient.bloodType}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/doctor/patients/${qrPatient.id}`)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    {t('View')}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
