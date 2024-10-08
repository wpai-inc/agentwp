import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import Fullscreen from '@material-design-icons/svg/outlined/fullscreen.svg?react';
import ExitFullscreen from '@material-design-icons/svg/outlined/fullscreen_exit.svg?react';
import DragIcon from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import { cn } from '@/lib/utils';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { Button } from '@/Components/ui/button';

const Corners = () => {
  return (
    <>
      <div className="absolute right-0 -top-3 external-border-top-left "></div>
      <div className="absolute right-0 -bottom-3 external-border-bottom-left "></div>
    </>
  );
};

export default function WindowActions( {
  toggle,
  handleDrag,
  maximizeWindow,
  restoreWindow,
  isMaximized,
  toggleMaximizeRestore,
  ...props
}: {
  toggle: () => void;
  onMouseEnter?: () => void;
  maximizeWindow?: () => void;
  restoreWindow?: () => void;
  isMaximized?: boolean;
  toggleMaximizeRestore?: () => void;
  handleDrag: ( e: MouseEvent ) => void;
} ) {
  return (
    <div
      onMouseDown={ e => handleDrag( e.nativeEvent ) }
      className={ cn(
        'absolute left-0 top-0 grid h-full grid-rows-2 pl-2 opacity-0 transition-all duration-300 z-10 group-hover/chat:-translate-x-full group-hover/chat:opacity-100',
      ) }
      { ...props }>
      <div className="overflow-hidden pl-3">
        <div className="relative z-0 mt-16 flex w-7 flex-col items-center justify-center gap-2 rounded-bl-lg rounded-tl-lg bg-white py-2 shadow-lg">
          { isMaximized ? (
            <AgentTooltip content="Return chat window to normal size" side="right">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={ toggleMaximizeRestore }>
                <ExitFullscreen
                  className={ cn( 'h-5 w-5 cursor-pointer hover:text-teal-500', 'text-gray-400' ) }
                />
              </Button>
            </AgentTooltip>
          ) : (
            <AgentTooltip
              content="Maximize the chat window to take all the available space"
              side="right">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={ toggleMaximizeRestore }>
                <Fullscreen className={ cn( 'h-5 w-5 hover:text-teal-500', 'text-gray-400' ) } />
              </Button>
            </AgentTooltip>
          ) }

          <AgentTooltip content="Close window" side="right">
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent" onClick={ toggle }>
              <CloseIcon
                className={ cn( 'h-4 w-4 cursor-pointer hover:text-red-500', 'text-gray-400' ) }
              />
            </Button>
          </AgentTooltip>
          <Corners />
        </div>
      </div>
      <div className="pl-4">
        <AgentTooltip content="Drag or double-click to reset window position" side="right">
          <button
            id="dragHandle"
            className="handle -translate-y-full cursor-move text-gray-400 hover:text-amber-500">
            <DragIcon />
            <DragIcon className="-mt-1.5" />
          </button>
        </AgentTooltip>
      </div>
    </div>
  );
}
