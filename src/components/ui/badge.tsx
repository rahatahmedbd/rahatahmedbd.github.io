import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--radius-full)] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-brand-primary)] text-white',
        secondary:
          'border-transparent bg-[var(--color-neutral-200)] text-[var(--color-text-primary)]',
        outline:
          'border-[var(--color-border)] text-[var(--color-text-primary)]',
        success:
          'border-transparent bg-[var(--color-success)] text-white',
        warning:
          'border-transparent bg-[var(--color-warning)] text-white',
        destructive:
          'border-transparent bg-[var(--color-error)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };