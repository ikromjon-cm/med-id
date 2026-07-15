'use client';

import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { CheckCircle, XCircle, Clock, AlertTriangle, Minus } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  active: {
    color: 'text-[#00C896]',
    bg: 'bg-[#00C896]/10',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  inactive: {
    color: 'text-gray-400',
    bg: 'bg-gray-100 ',
    icon: <Minus className="w-3 h-3" />,
  },
  suspended: {
    color: 'text-emergency',
    bg: 'bg-emergency/10',
    icon: <XCircle className="w-3 h-3" />,
  },
  'on-leave': {
    color: 'text-amber-500',
    bg: 'bg-amber-50 ',
    icon: <Clock className="w-3 h-3" />,
  },
  sent: {
    color: 'text-[#00C896]',
    bg: 'bg-[#00C896]/10',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  pending: {
    color: 'text-amber-500',
    bg: 'bg-amber-50 ',
    icon: <Clock className="w-3 h-3" />,
  },
  failed: {
    color: 'text-emergency',
    bg: 'bg-emergency/10',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.inactive;
  const isSmall = size === 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium capitalize',
        isSmall ? 'px-2.5 py-0.5 text-xs rounded-full' : 'px-3 py-1 text-sm rounded-lg',
        config.bg,
        config.color
      )}
    >
      {config.icon}
      {t(status)}
    </span>
  );
}
