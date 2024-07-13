import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  isShowing?: boolean;
};

export default function Handle( { position, className, isShowing = false }: Props ) {
  const [ isFirstLoad, setIsFirstLoad ] = useState( false );

  const postionClasses = {
    'top-left': cn(
      'cursor-nw-resize',
      'border-t-2 border-l-2 rounded-tl-full',
      'hover:-top-2 hover:-left-2 hover:border-t-4 hover:border-l-4',
      {
        'animate-slide-in-top-left': isShowing,
        'animate-slide-out-top-left': ! isShowing && ! isFirstLoad,
      },
    ),
    'top-right': cn(
      'cursor-sw-resize',
      'border-t-2 border-r-2 rounded-tr-full',
      'hover:-top-2 hover:-right-2 hover:border-t-4 hover:border-r-4',
      {
        'animate-slide-in-top-right': isShowing,
        'animate-slide-out-top-right': ! isShowing && ! isFirstLoad,
      },
    ),
    'bottom-left': cn(
      'cursor-sw-resize',
      'border-b-2 border-l-2 rounded-bl-full',
      'hover:-bottom-2 hover:-left-2 hover:border-b-4 hover:border-l-4',
      {
        'animate-slide-in-bottom-left': isShowing,
        'animate-slide-out-bottom-left': ! isShowing && ! isFirstLoad,
      },
    ),
    'bottom-right': cn(
      'cursor-nw-resize',
      'border-b-2 border-r-2 rounded-br-full',
      'hover:-bottom:-2 hover:-right-2 hover:border-b-4 hover:border-r-4',
      {
        'animate-slide-in-bottom-right': isShowing,
        'animate-slide-out-bottom-right': ! isShowing && ! isFirstLoad,
      },
    ),
  };

  useEffect( () => {
    if ( isFirstLoad && isShowing ) {
      setIsFirstLoad( false );
    }
  }, [ isShowing ] );

  useEffect( () => {
    setIsFirstLoad( true );
  }, [] );

  return (
    <div
      className={ cn(
        'resize-handler absolute w-4 h-4 border-brand-primary hover:border-brand-primary',
        'transition-all',
        postionClasses[ position ],
        {
          'opacity-0': isFirstLoad,
        },
        className,
      ) }></div>
  );
}
