'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, User, Droplets, CheckCircle, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import type { EmergencyAlert } from '@/lib/types';

interface EmergencyAlertCardProps {
  alert: EmergencyAlert;
  onResolve?: (id: string) => void;
  onViewProfile?: (patientId: string) => void;
  delay?: number;
}

export default function EmergencyAlertCard({ alert, onResolve, onViewProfile, delay = 0 }: EmergencyAlertCardProps) {
  const isActive = alert.status === 'ACTIVE';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className={cn(
        'rounded-2xl p-4 transition-all',
        isActive ? 'emergency-card emergency-glow' : 'glass-card'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          isActive ? 'bg-emergency/10 text-emergency' : 'bg-[#00C896]/10 text-[#00C896]'
        )}>
          {isActive ? <AlertTriangle className="w-5 h-5 blink-alert" /> : <CheckCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{alert.patientName}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Triggered by {alert.triggeredBy}</p>
            </div>
            <span className={cn(
              'px-2 py-0.5 text-[10px] font-semibold rounded-full whitespace-nowrap',
              isActive ? 'bg-emergency/10 text-emergency' : 'bg-[#00C896]/10 text-[#00C896]'
            )}>
              {alert.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" />
              {alert.bloodType}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {alert.id}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {isActive ? formatDateTime(alert.accessedAt) : `Resolved ${formatDateTime(alert.resolvedAt || '')}`}
            </span>
          </div>
          {alert.allergies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {alert.allergies.map(a => (
                <span key={a} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500">{a}</span>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            {onViewProfile && (
              <button onClick={() => onViewProfile(alert.patientId)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <ExternalLink className="w-3 h-3" /> View Profile
              </button>
            )}
            {isActive && onResolve && (
              <button onClick={() => onResolve(alert.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emergency/10 text-emergency hover:bg-emergency/20 transition-colors">
                <X className="w-3 h-3" /> Resolve
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
