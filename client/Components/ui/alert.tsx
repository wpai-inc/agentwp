import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export type AlertVariantProps = VariantProps< typeof alertVariants >;

const alertVariants = cva(
  'relative w-full rounded-lg [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 flex justify-between items-center',
  {
    variants: {
      variant: {
        default: 'bg-orange-200 text-orange-400',
        destructive: 'bg-red-200 text-red-400 [&>svg]:text-red-500',
        informative: 'bg-[#edacd2] text-white border-none',
      },
      size: {
        sm: 'text-sm rounded-xl py-1 px-3',
        default: 'text-base p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes< HTMLDivElement > & AlertVariantProps
>( ( { className, variant, size, ...props }, ref ) => (
  <div
    ref={ ref }
    role="alert"
    className={ cn( alertVariants( { variant, size } ), className ) }
    { ...props }
  />
) );
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes< HTMLHeadingElement >
>( ( { className, ...props }, ref ) => (
  <h5
    ref={ ref }
    className={ cn( 'mb-1 font-medium leading-none tracking-tight', className ) }
    { ...props }
  />
) );
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes< HTMLParagraphElement >
>( ( { className, ...props }, ref ) => (
  <div ref={ ref } className={ cn( '[&_p]:leading-relaxed', className ) } { ...props } />
) );
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
