'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, as = 'input', options, className, children, ...props }, ref) => {
    const baseClasses = cn(
      'w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200',
      'bg-white/80 dark:bg-gray-800/50',
      'border border-gray-200 dark:border-gray-700/50',
      'text-gray-900 dark:text-white',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-emergency focus:ring-emergency/20 focus:border-emergency',
      className
    );

    if (as === 'select') {
      return (
        <div className="space-y-1.5">
          {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
          <select className={baseClasses} {...(props as any)}>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            {children}
          </select>
          {error && <p className="text-xs text-emergency mt-1">{error}</p>}
        </div>
      );
    }

    if (as === 'textarea') {
      return (
        <div className="space-y-1.5">
          {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
          <textarea
            className={cn(baseClasses, 'min-h-[100px] resize-y')}
            {...(props as any)}
          />
          {error && <p className="text-xs text-emergency mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
        <input ref={ref as any} className={baseClasses} {...props} />
        {error && <p className="text-xs text-emergency mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
