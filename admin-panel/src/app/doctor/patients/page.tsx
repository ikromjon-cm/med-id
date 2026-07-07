'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search, User, Droplets, Phone, Calendar, ChevronRight
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';
import { getMyPatients } from '@/lib/mockData';
import type { Patient } from '@/lib/types';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

const DOCTOR_ID = 'DOC-001';

export default function MyPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const p = await getMyPatients(DOCTOR_ID);
      setPatients(p);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('My Patients')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('View and manage your patient list')}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t('Search patients...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('No patients found')} description={search ? t('Try a different search term.') : t('You have no patients assigned yet.')} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800/30">
            {filtered.map((patient, idx) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
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
      )}
    </div>
  );
}
