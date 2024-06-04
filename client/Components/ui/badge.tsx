import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-slate-200 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300',
  {
    variants: {
      size: {
        default: 'h-8 px-3',
        lg: 'h-11 px-8',
      },
      variant: {
        default:
          'border-transparent bg-brand-dark text-slate-50 dark:bg-slate-50 dark:text-brand-dark',
        primary:
          'border-transparent bg-brand-primary text-white hover:bg-brand-primary/90 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        destructive:
          'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80',
        outline: 'text-slate-950 dark:text-slate-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes< HTMLDivElement >,
    VariantProps< typeof badgeVariants > {}

function Badge( { className, variant, ...props }: BadgeProps ) {
  return <div className={ cn( badgeVariants( { variant } ), className ) } { ...props } />;
}

export { Badge, badgeVariants };
