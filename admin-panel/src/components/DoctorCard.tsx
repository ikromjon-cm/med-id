'use client';

import { motion } from 'framer-motion';
import { Stethoscope, MapPin, Users, Calendar } from 'lucide-react';
import { t } from '@/lib/i18n';
import StatusBadge from './StatusBadge';
import type { Doctor } from '@/lib/types';

interface DoctorCardProps {
  doctor: Doctor;
  onView?: (doctor: Doctor) => void;
  delay?: number;
}

export default function DoctorCard({ doctor, onView, delay = 0 }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="doctor-card-gradient glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onView?.(doctor)}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <Stethoscope className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{doctor.name}</h3>
              <p className="text-xs font-medium text-primary mt-0.5">{doctor.specialization}</p>
            </div>
            <StatusBadge status={doctor.status} />
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {doctor.clinic}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {doctor.patients} {t('patients')}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/30">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {t('ID')}: {doctor.id}
          </span>
          <span className="text-primary font-medium group-hover:underline">{t('View Profile')} →</span>
        </div>
      </div>
    </motion.div>
  );
}
