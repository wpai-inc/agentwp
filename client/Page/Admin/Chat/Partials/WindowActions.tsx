import React from 'react';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import MinimizeIcon from '@material-design-icons/svg/outlined/minimize.svg?react';
import MaximizeIcon from '@material-design-icons/svg/outlined/open_in_full.svg?react';
import ReduceWindowIcon from '@material-design-icons/svg/outlined/close_fullscreen.svg?react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';

export default function WindowActions() {
  const {
    toggle,
    isMaximized,
    maximizeChatWindow,
    reduceWindow,
  } = useChat();

  return (
    <div className={cn(
      'absolute bg-brand-gray h-20 w-6 -left-6 top-16',
      'flex flex-col items-center justify-center gap-2',
      'rounded-bl-lg rounded-tl-lg'
    )}
    >
      <MinimizeIcon
        onClick={toggle}
        className={cn(
          'h-5 w-5 text-brand-gray-50 cursor-pointer hover:text-amber-500'
        )}
      />
      {isMaximized ? (
        <ReduceWindowIcon
          onClick={reduceWindow}
          className={cn(
            'h-4 w-4 text-brand-gray-50 cursor-pointer hover:text-teal-500'
          )}
        />
      ): (
        <MaximizeIcon
          onClick={maximizeChatWindow}
          className={cn(
            'h-4 w-4 text-brand-gray-50 cursor-pointer hover:text-teal-500'
          )}
        />
      )}

      <CloseIcon
        onClick={toggle}
        className={cn(
          'h-4 w-4 text-brand-gray-50 cursor-pointer hover:text-red-500'
        )}
      />
    </div>
  );
};
