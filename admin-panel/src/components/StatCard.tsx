'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; isUp: boolean };
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'emergency' | 'amber';
  delay?: number;
}

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', glow: 'shadow-primary/15' },
  secondary: { bg: 'bg-[#00C896]/10', text: 'text-[#00C896]', glow: 'shadow-[#00C896]/15' },
  emergency: { bg: 'bg-emergency/10', text: 'text-emergency', glow: 'shadow-emergency/15' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-500', glow: 'shadow-amber-500/15' },
};

export default function StatCard({ title, value, icon, trend, subtitle, color = 'primary', delay = 0 }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn(
        'glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300',
        'group cursor-default'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-lg', colors.bg, colors.text)}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trend.isUp ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-emergency/10 text-emergency'
          )}>
            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
