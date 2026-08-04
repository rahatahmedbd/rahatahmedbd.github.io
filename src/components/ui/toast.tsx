'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  onClose: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  onClose,
}: ToastProps) {
  const variantClasses = {
    default: 'bg-[var(--color-surface)] border-[var(--color-border)]',
    success:
      'bg-[var(--color-success)]/10 border-[var(--color-success)] text-[var(--color-success-dark)]',
    error:
      'bg-[var(--color-error)]/10 border-[var(--color-error)] text-[var(--color-error-dark)]',
    warning:
      'bg-[var(--color-warning)]/10 border-[var(--color-warning)] text-[var(--color-warning-dark)]',
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-xl)] border p-4 shadow-[var(--shadow-lg)]',
        variantClasses[variant]
      )}
    >
      <div className="flex-1">
        {title && <p className="font-medium text-sm">{title}</p>}
        <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}