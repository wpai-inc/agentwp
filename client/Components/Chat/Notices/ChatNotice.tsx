import { useState } from 'react';
import { Alert, AlertDescription, AlertVariantProps } from '@/Components/ui/alert';
import React from 'react';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ChatNotice( {
  children,
  dismissable = false,
  onDismiss,
  variant,
  size,
  action,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  dismissable?: boolean | string;
  onDismiss?: () => void;
  action?: React.ReactNode;
} & AlertVariantProps ) {
  const [ dismissed, setDismissed ] = useState( false );

  function dismiss() {
    setDismissed( true );
    onDismiss && onDismiss();
  }

  return (
    <AnimatePresence>
      { ! dismissed && (
        <motion.div
          initial={ { opacity: 0, y: '100%', scaleY: 0 } }
          animate={ { opacity: 1, y: 0, scaleY: 1 } }
          exit={ { opacity: 0, y: '100%', scaleY: 0 } }>
          <Alert variant={ variant } size={ size } className={ cn( 'not-prose', className ) }>
            <AlertDescription>{ children }</AlertDescription>
            { dismissable && (
              <button onClick={ dismiss } className="text-base underline underline-offset-2">
                { typeof dismissable === 'string' ? (
                  dismissable
                ) : (
                  <CloseIcon className="h-4 w-4" />
                ) }
              </button>
            ) }
            { action && action }
          </Alert>
        </motion.div>
      ) }
    </AnimatePresence>
  );
}
