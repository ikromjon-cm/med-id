'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  UserCircle, QrCode, Phone, FileText, Calendar,
  Clock, ShieldCheck, Droplets, Heart, Activity,
  ChevronRight, Stethoscope, MapPin, AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  getPatientProfile, getPatientDocuments, getEmergencyContacts,
  patients, appointments
} from '@/lib/mockData';
import type { PatientProfile, Appointment } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { t } from '@/lib/i18n';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function PatientDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | undefined>();
  const [loading, setLoading] = useState(true);
  const patientId = 'PAT-001';

  useEffect(() => {
    async function load() {
      const p = await getPatientProfile(patientId);
      setProfile(p);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700/50 mb-4" />
              <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700/50 rounded" />
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700/50 rounded mb-6" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800/30 last:border-0">
              <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700/50" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500">{t('Patient not found')}</p>
      </div>
    );
  }

  const patientAppointments = appointments
    .filter(a => a.patientId === patientId)
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

  const upcomingAppts = patientAppointments.filter(a => a.status === 'scheduled' || a.status === 'in-progress');
  const completedCount = patientAppointments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary via-primary-dark to-secondary/80 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    {t('Verified Patient')}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
                  <span className="flex items-center gap-1.5">
                    <Droplets className="w-3 h-3" />
                    {profile.bloodType}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                {t('Welcome back')}, {profile.name.split(' ')[0]}
              </h2>
              <p className="text-white/70 text-sm">
                {t('Your medical profile is up to date. Stay healthy!')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">{t('Visits')}</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-2xl font-bold">{upcomingAppts.length}</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">{t('Upcoming')}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('Documents'), value: profile.documents.length, icon: FileText, color: 'from-blue-500 to-blue-600', path: '/documents' },
          { label: t('Upcoming Appointments'), value: upcomingAppts.length, icon: Calendar, color: 'from-emerald-500 to-emerald-600', path: '/appointments' },
          { label: t('Emergency Contacts'), value: profile.emergencyContacts.length, icon: Phone, color: 'from-amber-500 to-amber-600', path: '/emergency-contacts' },
          { label: t('Allergies'), value: profile.allergies.length, icon: AlertCircle, color: 'from-rose-500 to-rose-600', path: '/profile' },
        ].map((stat, i) => (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => router.push(stat.path)}
            className="glass-card rounded-2xl p-5 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                stat.color
              )}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            {t('Quick Actions')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t('View Profile'), icon: UserCircle, path: '/profile', color: 'text-primary' },
              { label: t('My QR Code'), icon: QrCode, path: '/qr-code', color: 'text-secondary' },
              { label: t('Emergency Contacts'), icon: Phone, path: '/emergency-contacts', color: 'text-amber-500' },
              { label: t('Upload Document'), icon: FileText, path: '/documents', color: 'text-blue-500' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800/50 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon className={cn('w-5 h-5', action.color)} />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t('Upcoming Appointments')}
            </h3>
            <button
              onClick={() => router.push('/appointments')}
              className="text-xs text-primary font-medium hover:underline"
            >
              {t('View all')}
            </button>
          </div>

          {upcomingAppts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('No upcoming appointments')}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('Your schedule is clear')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.slice(0, 3).map((appt, i) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary/70 flex items-center justify-center text-white flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {appt.doctorName}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(appt.date)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {appt.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                        <Stethoscope className="w-3 h-3" />
                        {appt.type}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {appt.clinicName}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-medium',
                    appt.status === 'scheduled' ? 'bg-primary/10 text-primary' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                  )}>
                    {appt.status === 'scheduled' ? t('Scheduled') : t('In Progress')}
                  </span>
                </motion.div>
              ))}
            </div>
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
          <Heart className="w-4 h-4 text-rose-500" />
          {t('Health Summary')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: t('Blood Type'), value: profile.bloodType, icon: Droplets, color: 'text-emergency' },
            { label: t('Height'), value: profile.height, icon: Activity, color: 'text-primary' },
            { label: t('Weight'), value: profile.weight, icon: Activity, color: 'text-secondary' },
            { label: t('Biometric'), value: profile.biometricEnabled ? t('Enabled') : t('Disabled'), icon: ShieldCheck, color: profile.biometricEnabled ? 'text-secondary' : 'text-gray-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50">
              <item.icon className={cn('w-5 h-5', item.color)} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
