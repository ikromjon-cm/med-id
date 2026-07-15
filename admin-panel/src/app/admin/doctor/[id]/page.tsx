'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Stethoscope, Calendar, Users, Activity, FileText, Pill, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import PatientCard from '@/components/PatientCard';
import AppointmentCard from '@/components/AppointmentCard';
import { getDoctorDetail } from '@/lib/mockData';
import type { DoctorDetail } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { t } from '@/lib/i18n';

export default function DoctorDetailPage() {
  const params = useParams();
  const [data, setData] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments' | 'diagnoses' | 'prescriptions'>('patients');

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getDoctorDetail(params.id as string);
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { queueMicrotask(() => load()); }, [load]);

  if (error) return <ErrorState onRetry={load} />;
  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-6">
        <Link href="/doctor" className="inline-flex items-center gap-1.5 text-sm text-gray-500  hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('Back to Doctors')}
        </Link>
        <EmptyState title={t('Doctor not found')} description={t('The requested doctor profile could not be found.')} />
      </div>
    );
  }

  const tabs = [
    { key: 'patients' as const, label: t('Patients'), count: data.patients.length, icon: Users },
    { key: 'appointments' as const, label: t('Appointments'), count: data.appointments.length, icon: Calendar },
    { key: 'diagnoses' as const, label: t('Diagnoses'), count: data.diagnoses.length, icon: FileText },
    { key: 'prescriptions' as const, label: t('Prescriptions'), count: data.prescriptions.length, icon: Pill },
  ];

  const activeAppointments = data.appointments.filter(a => a.status === 'scheduled' || a.status === 'in-progress');
  const completedAppointments = data.appointments.filter(a => a.status === 'completed');

  return (
    <div className="space-y-6">
      <Link href="/doctor" className="inline-flex items-center gap-1.5 text-sm text-gray-500  hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('Back to Doctors')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="doctor-card-gradient glass-card rounded-2xl p-6"
          >
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 ">{data.name}</h2>
                    <p className="text-sm text-primary font-medium mt-0.5">{data.specialization}</p>
                    <p className="text-xs text-gray-500  mt-1">{data.clinic} · {data.id}</p>
                  </div>
                  <StatusBadge status={data.status} size="md" />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 ">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {data.patients.length} {t('Patients')}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {activeAppointments.length} {t('Upcoming')}</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {completedAppointments.length} {t('Completed')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard title={t('Patients')} value={data.patients.length} icon={<Users className="w-5 h-5" />} color="primary" subtitle={t('Assigned')} />
            <StatCard title={t('Appointments')} value={data.appointments.length} icon={<Calendar className="w-5 h-5" />} color="secondary" subtitle={t('Total')} />
            <StatCard title={t('Diagnoses')} value={data.diagnoses.length} icon={<FileText className="w-5 h-5" />} color="amber" subtitle={t('Made')} />
            <StatCard title={t('Prescriptions')} value={data.prescriptions.length} icon={<Pill className="w-5 h-5" />} color="emergency" subtitle={t('Written')} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-900  mb-4">{t('Upcoming Appointments')}</h3>
          {activeAppointments.length === 0 ? (
            <p className="text-xs text-gray-500  text-center py-6">{t('No upcoming appointments')}</p>
          ) : (
            <div className="space-y-2">
              {activeAppointments.slice(0, 5).map((a, i) => (
                <AppointmentCard key={a.id} appointment={a} delay={i * 0.05} />
              ))}
            </div>
          )}
          {data.appointments.length > 5 && (
            <p className="text-xs text-primary font-medium text-center mt-3 cursor-pointer hover:underline">{data.appointments.length - 5} {t('more appointments')}</p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="flex border-b border-gray-100 ">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all relative ${
                  isActive ? 'text-primary' : 'text-gray-500  hover:text-gray-700 '
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
                  isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100  text-gray-500'
                }`}>{tab.count}</span>
                {isActive && <motion.div layoutId="doctorTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {activeTab === 'patients' && (
            data.patients.length === 0 ? (
              <EmptyState title={t('No patients')} description={t('This doctor has no assigned patients.')} />
            ) : (
              <div className="space-y-1">
                {data.patients.map((p, i) => (
                  <PatientCard key={p.id} patient={p} delay={i * 0.03} />
                ))}
              </div>
            )
          )}

          {activeTab === 'appointments' && (
            data.appointments.length === 0 ? (
              <EmptyState title={t('No appointments')} description={t('No appointments found for this doctor.')} />
            ) : (
              <div className="space-y-1">
                {data.appointments.map((a, i) => (
                  <AppointmentCard key={a.id} appointment={a} delay={i * 0.03} />
                ))}
              </div>
            )
          )}

          {activeTab === 'diagnoses' && (
            data.diagnoses.length === 0 ? (
              <EmptyState title={t('No diagnoses')} description={t('No diagnoses recorded for this doctor.')} />
            ) : (
              <div className="space-y-2">
                {data.diagnoses.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50  transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-50  flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 ">{d.condition}</p>
                      <p className="text-xs text-gray-500  mt-0.5">{d.patientName} · {formatDate(d.date)}</p>
                      <p className="text-xs text-gray-400  mt-1 line-clamp-2">{d.notes}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}

          {activeTab === 'prescriptions' && (
            data.prescriptions.length === 0 ? (
              <EmptyState title={t('No prescriptions')} description={t('No prescriptions written by this doctor.')} />
            ) : (
              <div className="space-y-2">
                {data.prescriptions.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50  transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 ">{p.medication}</p>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-xs text-gray-500  mt-0.5">{p.patientName} · {p.dosage} · {p.frequency}</p>
                      <p className="text-xs text-gray-400  mt-0.5">{formatDate(p.startDate)} - {formatDate(p.endDate)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
