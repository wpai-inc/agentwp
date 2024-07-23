import { useState } from 'react';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import MaximizeIcon from '@material-design-icons/svg/outlined/open_with.svg?react';
import DragIcon from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import ReduceWindowIcon from '@material-design-icons/svg/outlined/close_fullscreen.svg?react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';

const Corners = () => {
  return (
    <>
      <div className="absolute -top-3 left-3 border-brand-gray min-h-4 w-4 rounded-br-full border-b-4 border-r-4 shadow-xl"></div>
      <div className="absolute -bottom-3 left-3 border-brand-gray min-h-4 w-4 rounded-tr-full border-t-4 border-r-4 shadow-xl"></div>
    </>
  );
};

export default function WindowActions( {
  show = false,
  handleDrag,
  maximizeWindow,
  restoreWindow,
  isMaximized,
  ...props
}: {
  show?: boolean;
  onMouseEnter?: () => void;
  maximizeWindow?: () => void;
  restoreWindow?: () => void;
  isMaximized?: boolean;
  handleDrag: ( e: MouseEvent ) => void;
} ) {
  const { toggle } = useChat();
  const [ isFirstLoad ] = useState( false );

  return (
    <div
      onMouseDown={ e => handleDrag( e.nativeEvent ) }
      className={ cn(
        'absolute bg-brand-gray h-20 w-6 top-16 left-0 flex flex-col items-center justify-center gap-2 rounded-bl-lg rounded-tl-lg opacity-0 transition-all duration-300 shadow-xl',
        {
          'opacity-100 -translate-x-full': show,
          'animate-slide-in': show,
          'animate-slide-out': ! show && ! isFirstLoad,
        },
      ) }
      { ...props }>
      <AgentTooltip content="Drag or double-click to reset window position" side="right">
        <DragIcon
          id="dragHandle"
          className={ cn( 'handle h-6 w-6 hover:text-amber-500 cursor-move', 'text-gray-400' ) }
        />
      </AgentTooltip>
      { isMaximized ? (
        <AgentTooltip content="Return chat window to normal size" side="right">
          <ReduceWindowIcon
            onClick={ restoreWindow }
            className={ cn( 'h-4 w-4 cursor-pointer hover:text-teal-500', 'text-gray-400' ) }
          />
        </AgentTooltip>
      ) : (
        <AgentTooltip
          content="Maximize the chat window to take all the available space"
          side="right">
          <MaximizeIcon
            onClick={ maximizeWindow }
            className={ cn(
              'h-4 w-4 cursor-pointer hover:text-teal-500 rotate-45',
              'text-gray-400',
            ) }
          />
        </AgentTooltip>
      ) }

      <AgentTooltip content="Close window" side="right">
        <CloseIcon
          onClick={ toggle }
          className={ cn( 'h-5 w-5 cursor-pointer hover:text-red-500', 'text-gray-400' ) }
        />
      </AgentTooltip>
      <Corners />
    </div>
  );
}
