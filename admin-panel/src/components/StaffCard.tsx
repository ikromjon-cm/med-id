'use client';

import { motion } from 'framer-motion';
import { Stethoscope, Heart, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface StaffCardProps {
  name: string;
  role: string;
  status: string;
  delay?: number;
}

const roleIcons: Record<string, React.ReactNode> = {
  doctor: <Stethoscope className="w-4 h-4" />,
  nurse: <Heart className="w-4 h-4" />,
  receptionist: <Users className="w-4 h-4" />,
};

export default function StaffCard({ name, role, status, delay = 0 }: StaffCardProps) {
  const Icon = roleIcons[role.toLowerCase()] || <User className="w-4 h-4" />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        role === 'doctor' ? 'bg-primary/10 text-primary' :
        role === 'nurse' ? 'bg-[#00C896]/10 text-[#00C896]' :
        'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
      )}>
        {Icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
      </div>
      <StatusBadge status={status} />
    </motion.div>
  );
}
