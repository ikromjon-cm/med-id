'use client';

import { motion } from 'framer-motion';
import { Clock, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { QueueEntry } from '@/lib/types';

interface QueueCardProps {
  entry: QueueEntry;
  delay?: number;
}

const priorityColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  LOW: { bg: 'bg-[#00C896]/10', text: 'text-[#00C896]', dot: 'bg-[#00C896]', label: t('Low') },
  MEDIUM: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500', label: t('Medium') },
  HIGH: { bg: 'bg-emergency/10', text: 'text-emergency', dot: 'bg-emergency', label: t('High') },
  CRITICAL: { bg: 'bg-emergency/10', text: 'text-emergency', dot: 'bg-emergency pulse-dot', label: t('Critical') },
};

const statusStyles: Record<string, string> = {
  WAITING: 'text-amber-500',
  WITH_DOCTOR: 'text-primary',
  COMPLETED: 'text-[#00C896]',
};

export default function QueueCard({ entry, delay = 0 }: QueueCardProps) {
  const pc = priorityColors[entry.priority];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      className={cn(
        'flex items-center gap-4 p-3 rounded-xl transition-colors',
        `queue-priority-${entry.priority.toLowerCase()}`,
        'bg-white/50 dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/40'
      )}
    >
      <div className={cn('w-3 h-3 rounded-full flex-shrink-0', pc.dot)} />
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{entry.patientName}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            <span className={cn('capitalize font-medium', statusStyles[entry.status])}>{entry.status.replace('_', ' ')}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {entry.waitTimeMinutes} {t('min')}
            </span>
          </div>
        </div>
      </div>
      <span className={cn('px-2 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-1', pc.bg, pc.text)}>
        {entry.priority === 'CRITICAL' && <AlertTriangle className="w-2.5 h-2.5" />}
        {pc.label}
      </span>
    </motion.div>
  );
}
