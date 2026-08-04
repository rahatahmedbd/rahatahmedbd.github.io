import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export function SectionTitle({
  title,
  subtitle,
  align = 'left',
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-8',
        {
          'text-left': align === 'left',
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
        className
      )}
      {...props}
    >
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}