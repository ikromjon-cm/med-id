'use client';

import { AlertTriangle } from 'lucide-react';

interface EmergencyBadgeProps {
  count: number;
  onClick?: () => void;
}

export default function EmergencyBadge({ count, onClick }: EmergencyBadgeProps) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className="emergency-glow inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emergency/10 text-emergency text-xs font-semibold blink-alert hover:bg-emergency/20 transition-colors"
    >
      <AlertTriangle className="w-3.5 h-3.5" />
      {count} Active
    </button>
  );
}
