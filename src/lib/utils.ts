import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes.
 * Uses clsx + tailwind-merge for optimal class handling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}