import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        'default': 'bg-brand-gray text-black opacity-75 gap-0.5 hover:opacity-100',
        'destructive':
          'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
        'outline':
          'border border-slate-200 bg-white hover:bg-brand-gray hover:text-brand-dark dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        'secondary':
          'bg-brand-gray text-brand-dark hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        'ghost':
          'hover:bg-slate-100 hover:text-brand-dark dark:hover:bg-slate-800 dark:hover:text-slate-50',
        'link': 'text-brand-dark underline-offset-4 hover:underline dark:text-slate-50',
        'brand': 'text-white bg-brand-primary border-brand-primary',
        'dark': 'text-white bg-brand-dark hover:bg-brand-primary',
        'brand-outline': 'text-brand-gray-30 bg-white border border-brand-gray-30',
        'brand-gray': 'text-brand-gray-70 bg-brand-gray-20',
      },
      size: {
        default: 'py-1 px-3 text-sm',
        sm: 'py-1 px-1.5 text-xs',
        lg: 'text-lg',
        icon: 'h-10 w-10',
      },
      isBusy: {
        true: 'cursor-wait animate-is-busy',
      },
      pill: {
        true: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes< HTMLButtonElement >,
    VariantProps< typeof buttonVariants > {
  asChild?: boolean;
  isBusy?: boolean;
}

const Button = forwardRef< HTMLButtonElement, ButtonProps >(
  ( { className, variant, size, pill, isBusy, asChild = false, ...props }, ref ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={ cn( buttonVariants( { variant, size, className, pill, isBusy } ) ) }
        ref={ ref }
        { ...props }
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
