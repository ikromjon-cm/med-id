'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

interface EmergencyStatsProps {
  activeAlerts: number;
  resolvedToday: number;
  avgResponseTime: string;
  totalAlerts: number;
}

export default function EmergencyStats({ activeAlerts, resolvedToday, avgResponseTime, totalAlerts }: EmergencyStatsProps) {
  const stats = [
    {
      label: t('Active Alerts'),
      value: activeAlerts,
      icon: AlertTriangle,
      color: 'text-emergency',
      bg: 'bg-emergency/10',
      alert: true,
    },
    {
      label: t('Resolved Today'),
      value: resolvedToday,
      icon: CheckCircle,
      color: 'text-[#00C896]',
      bg: 'bg-[#00C896]/10',
    },
    {
      label: t('Avg Response'),
      value: avgResponseTime,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: t('Total Alerts'),
      value: totalAlerts,
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={cn(
            'glass-card rounded-2xl p-4',
            s.alert && 'emergency-card'
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg, s.color)}>
              <s.icon className={cn('w-5 h-5', s.alert && 'blink-alert')} />
            </div>
          </div>
          <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
