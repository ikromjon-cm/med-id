'use client';

import { motion } from 'framer-motion';
import { User, Droplets, Calendar } from 'lucide-react';
import { t } from '@/lib/i18n';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/utils';
import type { Patient } from '@/lib/types';

interface PatientCardProps {
  patient: Patient;
  delay?: number;
}

export default function PatientCard({ patient, delay = 0 }: PatientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{patient.name}</p>
          <StatusBadge status={patient.status} />
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                <span>{patient.age} {t('yrs')}, {patient.gender}</span>
          <span className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {patient.bloodType}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(patient.lastVisit)}
          </span>
        </div>
      </div>
      <button className="text-xs text-primary font-medium hover:underline flex-shrink-0">{t('View')}</button>
    </motion.div>
  );
}
