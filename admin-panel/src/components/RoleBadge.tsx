'use client';

import { cn } from '@/lib/utils';
import { Shield, Stethoscope, Heart, Users, User } from 'lucide-react';

interface RoleBadgeProps {
  role: string;
}

const roleConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  admin: {
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    icon: <Shield className="w-3.5 h-3.5" />,
  },
  doctor: {
    color: 'text-primary',
    bg: 'bg-primary/10',
    icon: <Stethoscope className="w-3.5 h-3.5" />,
  },
  nurse: {
    color: 'text-[#00C896]',
    bg: 'bg-[#00C896]/10',
    icon: <Heart className="w-3.5 h-3.5" />,
  },
  receptionist: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    icon: <Users className="w-3.5 h-3.5" />,
  },
  patient: {
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    icon: <User className="w-3.5 h-3.5" />,
  },
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role.toLowerCase()] || {
    color: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    icon: <User className="w-3.5 h-3.5" />,
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full capitalize', config.bg, config.color)}>
      {config.icon}
      {role}
    </span>
  );
}
