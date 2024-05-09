import React from 'react';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import ExpandIcon from '@material-design-icons/svg/outlined/open_in_full.svg?react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';

export default function WindowActions() {
  const { toggle, expandChatWindow } = useChat();

  return (
    <div className={cn(
      'absolute bg-brand-gray h-14 w-6 -right-6 top-16',
      'flex flex-col items-center justify-center gap-2',
      'rounded-br-lg rounded-tr-lg'
    )}
    >
      <ExpandIcon
        onClick={expandChatWindow}
        className={cn(
          'h-4 w-4 text-brand-gray-50 cursor-pointer'
        )}
      />
      <CloseIcon
        onClick={toggle}
        className={cn(
          'h-4 w-4 text-brand-gray-50 cursor-pointer'
        )}
      />
    </div>
  );
};
