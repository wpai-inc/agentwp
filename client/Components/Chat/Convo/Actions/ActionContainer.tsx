import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/Components/Spinner';
import IconRenew from '@material-design-icons/svg/outlined/autorenew.svg?react';

export default function ActionContainer( {
  title,
  pending,
  children,
  className,
  handleRetry,
  icon,
}: {
  title: string;
  pending: boolean;
  children?: React.ReactNode;
  className?: string;
  handleRetry?: () => void;
  icon?: React.ReactNode;
} ) {
  const iconClassName = 'text-gray-400 h-5 w-5';

  function shouldClick() {
    if ( handleRetry ) return true;
    if ( children ) return true;
    return false;
  }

  function handleOnClick() {
    if ( handleRetry ) return handleRetry();
  }

  return (
    <div
      onClick={ handleOnClick }
      className={ cn(
        'min-h-10 bg-brand-gray-25 p-2 px-4 items-center rounded-lg gap-4 my-2 border-2 border-brand-gray-25 text-gray-700 text-sm w-full',
        { 'cursor-pointer': shouldClick() },
        className,
      ) }>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center max-w-full">
          { pending && ! handleRetry ? (
            <Spinner show={ true } />
          ) : (
            icon && React.cloneElement( icon, { className: iconClassName } )
          ) }
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">{ title }</p>
        </div>
        { ! pending && handleRetry && <IconRenew className={ iconClassName } /> }
      </div>
      { children }
    </div>
  );
}
