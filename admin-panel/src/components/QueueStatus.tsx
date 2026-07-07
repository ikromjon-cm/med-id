'use client';

import { motion } from 'framer-motion';
import { Clock, UserCheck, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { QueueEntry } from '@/lib/types';
import QueueCard from './QueueCard';

interface QueueStatusProps {
  entries: QueueEntry[];
}

export default function QueueStatus({ entries }: QueueStatusProps) {
  const waiting = entries.filter(e => e.status === 'WAITING');
  const withDoctor = entries.filter(e => e.status === 'WITH_DOCTOR');
  const completed = entries.filter(e => e.status === 'COMPLETED');
  const critical = entries.filter(e => e.priority === 'CRITICAL' && e.status !== 'COMPLETED');

  const stats = [
    { label: t('Waiting'), count: waiting.length, icon: Users, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: t('With Doctor'), count: withDoctor.length, icon: UserCheck, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('Completed'), count: completed.length, icon: Clock, color: 'text-[#00C896]', bg: 'bg-[#00C896]/10' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {stats.map((s) => (
          <div key={s.label} className={cn('flex-1 rounded-xl p-3 text-center', s.bg)}>
            <s.icon className={cn('w-4 h-4 mx-auto mb-1', s.color)} />
            <p className={cn('text-lg font-bold', s.color)}>{s.count}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
      {critical.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emergency/10 text-emergency text-xs font-medium">
          <AlertTriangle className="w-4 h-4" />
          {critical.length} {critical.length !== 1 ? t('critical patients') : t('critical patient')} {t('in queue')}
        </div>
      )}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">{t('No entries in queue')}</p>
        ) : (
          entries.map((entry, i) => (
            <QueueCard key={entry.id} entry={entry} delay={i * 0.03} />
          ))
        )}
      </div>
    </div>
  );
}
