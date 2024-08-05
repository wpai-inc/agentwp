import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import Fullscreen from '@material-design-icons/svg/outlined/fullscreen.svg?react';
import ExitFullscreen from '@material-design-icons/svg/outlined/fullscreen_exit.svg?react';
import DragIcon from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import { cn } from '@/lib/utils';
import { AgentTooltip } from '@/Components/ui/tooltip';

const Corners = () => {
  return (
    <>
      <div className="absolute -right-1 -top-3 h-4 w-4 rounded-br-full border-b-4 border-r-4 border-brand-gray shadow-xl"></div>
      <div className="absolute -bottom-3 -right-1 h-4 w-4 rounded-tr-full border-r-4 border-t-4 border-brand-gray shadow-xl"></div>
    </>
  );
};

export default function WindowActions( {
  show = false,
  toggle,
  handleDrag,
  maximizeWindow,
  restoreWindow,
  isMaximized,
  ...props
}: {
  show?: boolean;
  toggle: () => void;
  onMouseEnter?: () => void;
  maximizeWindow?: () => void;
  restoreWindow?: () => void;
  isMaximized?: boolean;
  handleDrag: ( e: MouseEvent ) => void;
} ) {
  return (
    <div
      onMouseDown={ e => handleDrag( e.nativeEvent ) }
      className={ cn(
        'absolute left-0 top-0 grid h-full grid-rows-2 overflow-hidden pl-2 opacity-0 transition-all duration-300',
        {
          '-translate-x-full opacity-100': show,
        },
      ) }
      { ...props }>
      <div>
        <div className="relative z-0 mt-16 flex w-6 flex-col items-center justify-center gap-2 rounded-bl-lg rounded-tl-lg bg-brand-gray py-2 shadow-xl">
          { isMaximized ? (
            <AgentTooltip content="Return chat window to normal size" side="right">
              <ExitFullscreen
                onClick={ restoreWindow }
                className={ cn( 'h-4 w-4 cursor-pointer hover:text-teal-500', 'text-gray-400' ) }
              />
            </AgentTooltip>
          ) : (
            <AgentTooltip
              content="Maximize the chat window to take all the available space"
              side="right">
              <Fullscreen
                onClick={ maximizeWindow }
                className={ cn( 'h-4 w-4 cursor-pointer hover:text-teal-500', 'text-gray-400' ) }
              />
            </AgentTooltip>
          ) }

          <AgentTooltip content="Close window" side="right">
            <CloseIcon
              onClick={ toggle }
              className={ cn( 'h-4 w-4 cursor-pointer hover:text-red-500', 'text-gray-400' ) }
            />
          </AgentTooltip>
          <Corners />
        </div>
      </div>
      <div>
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
