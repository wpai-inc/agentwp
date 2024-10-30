import React, { useState, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/Components/Spinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import IconRenew from '@material-design-icons/svg/outlined/autorenew.svg?react';
import IconAdd from '@material-design-icons/svg/outlined/add.svg?react';
import IconRemove from '@material-design-icons/svg/outlined/remove.svg?react';
import IconAlert from '@material-design-icons/svg/outlined/error_outline.svg?react';
import { AgentTooltip } from '@/Components/ui/tooltip';

export default function ActionContainer( {
  title,
  pending,
  children,
  className,
  handleRetry,
  icon,
  error,
  open = false,
}: {
  title: string;
  pending: boolean;
  children?: React.ReactNode;
  className?: string;
  handleRetry?: () => void;
  icon?: React.ReactNode;
  error?: string;
  open?: boolean;
} ) {
  const [ isOpen, setIsOpen ] = useState( open );
  const hasError = error && error.length > 0;

  const iconClassName = 'opacity-40 h-5 w-5';

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
        'min-h-10 bg-brand-gray py-2 px-4 items-center rounded-xl gap-2 text-gray-700 text-sm w-full',
        {
          'cursor-pointer': shouldClick(),
          'opacity-60 text-gray-500': hasError,
        },
        className,
      ) }>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center w-full">
          <div>
            { pending && ! handleRetry ? (
              <Spinner show={ true } />
            ) : hasError ? (
              <AgentTooltip content={ error }>
                <button>
                  <IconAlert className={ `${ iconClassName } text-red-500` } />
                </button>
              </AgentTooltip>
            ) : (
              icon && React.cloneElement( icon as ReactElement, { className: iconClassName } )
            ) }
          </div>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">{ title }</p>
          { ! pending && handleRetry && <IconRenew className={ iconClassName } /> }
          { children && ! handleRetry && (
            <CollapsibleTrigger>
              <button>
                { ! isOpen && <IconAdd className={ iconClassName } /> }
                { isOpen && <IconRemove className={ iconClassName } /> }
              </button>
            </CollapsibleTrigger>
          ) }
        </div>
      </div>
      { children && <CollapsibleContent className="pt-4">{ children }</CollapsibleContent> }
    </Collapsible>
  );
}
