'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  User, Stethoscope, Ambulance, Building2, Shield,
} from 'lucide-react';
import { t } from '@/lib/i18n';

const roles = [
  { key: 'patient', icon: <User className="w-8 h-8" />, title: t('Patient'), subtitle: t('View and manage your medical profile'), route: '/patient/dashboard' },
  { key: 'doctor', icon: <Stethoscope className="w-8 h-8" />, title: t('Doctor'), subtitle: t('Manage patients and prescriptions'), route: '/doctor/dashboard' },
  { key: 'clinic', icon: <Building2 className="w-8 h-8" />, title: t('Clinic'), subtitle: t('Clinic management and queue'), route: '/clinic/dashboard' },
  { key: 'emergency', icon: <Ambulance className="w-8 h-8" />, title: t('Emergency'), subtitle: t('Emergency medical data access'), route: '/emergency/dashboard' },
  { key: 'admin', icon: <Shield className="w-8 h-8" />, title: t('Admin'), subtitle: t('Full system administration'), route: '/admin/dashboard' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main  p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <div className="glass-card rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.jpg" alt="MED-ID" width={64} height={64} className="rounded-2xl mb-4 shadow-xl" />
            <h1 className="text-2xl font-bold text-gray-900 ">{t('Select Your Role')}</h1>
            <p className="text-sm text-gray-500  mt-1">{t('Choose the interface that suits you')}</p>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {roles.map((role) => (
              <motion.div key={role.key} variants={item}>
                <a
                  href={role.route}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white  border border-gray-100  hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    {role.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-gray-900 ">{role.title}</div>
                    <div className="text-sm text-gray-500 ">{role.subtitle}</div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100  flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
