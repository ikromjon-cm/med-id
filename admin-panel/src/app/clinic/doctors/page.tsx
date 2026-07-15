'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import DoctorCard from '@/components/DoctorCard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { getClinicDetail } from '@/lib/mockData';
import { t } from '@/lib/i18n';
import type { Doctor } from '@/lib/types';

const CLINIC_ID = 'CLN-001';

export default function ClinicDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const detail = await getClinicDetail(CLINIC_ID);
      setDoctors(detail?.doctors || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { queueMicrotask(() => loadData()); }, [loadData]);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 ">{t('Doctors')}</h2>
        <p className="text-sm text-gray-500  mt-1">{t('Manage clinic doctors and schedules')}</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t('Search doctors...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/70  border border-gray-200  text-gray-900  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200 " />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200  rounded" />
                  <div className="h-3 w-24 bg-gray-200  rounded" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 ">
                <div className="h-3 w-40 bg-gray-200  rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title={t('No doctors found')} description={search ? t('Try a different search term.') : t('No doctors assigned to this clinic yet.')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} delay={i * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
