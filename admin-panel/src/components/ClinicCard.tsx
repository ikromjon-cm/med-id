'use client';

import { motion } from 'framer-motion';
import { Building2, MapPin, Phone, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { Clinic } from '@/lib/types';

interface ClinicCardProps {
  clinic: Clinic;
  onView?: (clinic: Clinic) => void;
  delay?: number;
}

export default function ClinicCard({ clinic, onView, delay = 0 }: ClinicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="clinic-card-gradient glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onView?.(clinic)}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#00C896]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <Building2 className="w-7 h-7 text-[#00C896]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{clinic.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{clinic.id}</p>
            </div>
            <StatusBadge status={clinic.status} />
          </div>
          <div className="mt-3 space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {clinic.address}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              {clinic.phone}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/30 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Users className="w-3.5 h-3.5" />
          {clinic.doctorsCount} doctors
        </span>
        <span className="text-xs text-[#00C896] font-medium group-hover:underline">View Details →</span>
      </div>
    </motion.div>
  );
}
