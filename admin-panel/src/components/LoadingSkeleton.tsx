'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  type?: 'card' | 'table' | 'chart' | 'text' | 'circle';
}

export default function LoadingSkeleton({ className, count = 1, type = 'text' }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {skeletons.map(i => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700/50" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700/50" />
            </div>
            <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700/50 mb-2" />
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700/50" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn('glass-card rounded-2xl p-6 animate-pulse', className)}>
        <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700/50 mb-6" />
        <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800/30" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn('glass-card rounded-2xl p-6 animate-pulse', className)}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700/50" />
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-gray-700/50" />
        </div>
        {skeletons.map(i => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800/30">
            <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700/50" />
            <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700/50" />
            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700/50" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700/50" />
            <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700/50" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('animate-pulse', className)}>
      {skeletons.map(i => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded w-full mb-2" />
      ))}
    </div>
  );
}
