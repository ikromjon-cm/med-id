'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { t } from '@/lib/i18n';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = t('Something went wrong'),
  description = t('An error occurred while loading the data. Please try again.'),
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-emergency/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-10 h-10 text-emergency" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900  mb-1">{title}</h3>
      <p className="text-sm text-gray-500  text-center max-w-sm mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('Try Again')}
        </button>
      )}
    </div>
  );
}
