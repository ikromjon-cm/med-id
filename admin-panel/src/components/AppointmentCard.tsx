'use client';

import { motion } from 'framer-motion';
import { Clock, Calendar, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types';

interface AppointmentCardProps {
  appointment: Appointment;
  delay?: number;
}

const statusStyles: Record<string, string> = {
  scheduled: 'bg-primary/10 text-primary',
  'in-progress': 'bg-amber-50 dark:bg-amber-500/10 text-amber-500',
  completed: 'bg-[#00C896]/10 text-[#00C896]',
  cancelled: 'bg-gray-100 dark:bg-gray-800/50 text-gray-400',
};

export default function AppointmentCard({ appointment, delay = 0 }: AppointmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
    >
      <div className="text-center flex-shrink-0 w-12">
        <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{appointment.time.split(':')[0]}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{appointment.time.split(':')[1]}</p>
      </div>
      <div className="w-px h-10 bg-gray-200 dark:bg-gray-700/50 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{appointment.patientName}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Stethoscope className="w-3 h-3" />
            {appointment.doctorName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {appointment.date}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full capitalize', statusStyles[appointment.status])}>
          {appointment.status}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{appointment.type}</span>
      </div>
    </motion.div>
  );
}
