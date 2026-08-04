import * as React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export function Grid({
  cols = 1,
  gap = 'md',
  responsive = true,
  className,
  children,
  ...props
}: GridProps) {
  const gapClass = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  }[gap];

  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  }[cols];

  return (
    <div
      className={cn(
        'grid',
        responsive ? colClass : `grid-cols-${cols}`,
        gapClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}