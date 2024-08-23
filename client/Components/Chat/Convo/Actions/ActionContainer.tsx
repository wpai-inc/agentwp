import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/Components/Spinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import IconRenew from '@material-design-icons/svg/outlined/autorenew.svg?react';
import IconAdd from '@material-design-icons/svg/outlined/add.svg?react';
import IconRemove from '@material-design-icons/svg/outlined/remove.svg?react';

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
  const [ isOpen, setIsOpen ] = useState( false );

  const iconClassName = 'text-gray-400 h-5 w-5';

  function shouldClick() {
    if ( handleRetry ) return true;
    return false;
  }

  function handleOnClick() {
    if ( handleRetry ) return handleRetry();
  }

  return (
    <Collapsible
      open={ isOpen }
      onOpenChange={ setIsOpen }
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
        { children && ! handleRetry && (
          <CollapsibleTrigger>
            { ! isOpen && <IconAdd className={ iconClassName } /> }
            { isOpen && <IconRemove className={ iconClassName } /> }
          </CollapsibleTrigger>
        ) }
      </div>
      { children && <CollapsibleContent className="pt-4">{ children }</CollapsibleContent> }
    </Collapsible>
  );
}
