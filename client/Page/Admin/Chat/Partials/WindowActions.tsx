import React from 'react';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import MinimizeIcon from '@material-design-icons/svg/outlined/minimize.svg?react';
import MaximizeIcon from '@material-design-icons/svg/outlined/open_with.svg?react';
import DragIcon from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import ReduceWindowIcon from '@material-design-icons/svg/outlined/close_fullscreen.svg?react';
import { cn, getChatwindowElement, resetChatWindowPosition } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';

export default function WindowActions() {
  const { setSettings } = useClientSettings();
  const {
    toggle,
    isMaximized,
    maximizeChatWindow,
    reduceWindow,
  } = useChat();

  function onMaximizeClick() {
    const element = getChatwindowElement();
    maximizeChatWindow(element);
  }

  function onDragDoubleClick(e) {
    resetChatWindowPosition();
    setSettings({
      x: 0,
      y: 0,
      width: null,
      height: null,
    });
  }

  function startDrag(e) {
    e.preventDefault();
    const chatWindow = getChatwindowElement();
    if (chatWindow.classList.contains('maximized')) {
      return;
    }
    const bodyElement = document.getElementsByTagName('body')[0];
    const containerElement = document.getElementById('wpbody');
    const containerCoords = containerElement.getBoundingClientRect();
    const initialMousePositionX = e.clientX;
    const initialMousePositionY = e.clientY;
    const computedStyle = window.getComputedStyle(chatWindow);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);

    const initialPositionX = matrix.m41;
    const initialPositionY = matrix.m42;
    let lastPositionX = matrix.m41;
    let lastPositionY = matrix.m42;

    let startPosX = e.clientX - chatWindow.getBoundingClientRect().left;
    let startPosY = e.clientY - chatWindow.getBoundingClientRect().top;

    const disableDrag = (e) => {
      setSettings({
        x: lastPositionX,
        y: lastPositionY,
      });
      bodyElement.removeEventListener('mousemove', handleDrag);
      bodyElement.onmouseup = null;
    };

    const drag = (target, x, y) => {
      const chatWindowCoords = target.getBoundingClientRect();
      const currentPositionMatrix = new DOMMatrixReadOnly(computedStyle.transform);

      // check if any of the new bounding rects are out of bounds
      const newPositionLeft = x - startPosX;
      const newPositionRight = x - startPosX + chatWindowCoords.width;
      const newPositionTop = y - startPosY;
      const newPositionBottom = y - startPosY + chatWindowCoords.height;
      const leftOutOfBounds = newPositionLeft < containerCoords.left;
      const rightOutOfBounds = newPositionRight > containerCoords.right;
      const topOutOfBounds = newPositionTop < containerCoords.top;
      const bottomOutOfBounds = newPositionBottom > containerCoords.bottom;

      let newCoordsX = currentPositionMatrix.m41;
      let newCoordsY = currentPositionMatrix.m42;

      if (!leftOutOfBounds && !rightOutOfBounds) {
        newCoordsX = x - initialMousePositionX + initialPositionX;
      }

      if (!topOutOfBounds && !bottomOutOfBounds) {
        newCoordsY = y - initialMousePositionY + initialPositionY;
      }

      target.style.transform = `translate(${newCoordsX}px, ${newCoordsY}px)`;
      lastPositionX = newCoordsX;
      lastPositionY = newCoordsY;
    };

    const handleDrag = (e) => {
      drag(chatWindow, e.clientX, e.clientY);
    };

    bodyElement.addEventListener('mousemove', handleDrag);
    bodyElement.addEventListener('mouseup', disableDrag);
  }

  return (
    <div className={cn(
      'absolute bg-brand-gray h-20 w-6 -left-6 top-11',
      'flex flex-col items-center justify-center gap-2',
      'rounded-bl-lg rounded-tl-lg'
    )}
    >
      <AgentTooltip
        content="Drag or double-click to reset window position"
        side="right"
      >
        <DragIcon
          id="drag-icon"
          onMouseDown={startDrag}
          onDoubleClick={onDragDoubleClick}
          className={cn(
            'h-6 w-6 cursor-pointer hover:text-amber-500 cursor-move'
          )}
        />
      </AgentTooltip>
      {/*<MinimizeIcon*/}
      {/*  onClick={toggle}*/}
      {/*  className={cn(*/}
      {/*    'h-5 w-5 text-brand-gray-50 cursor-pointer hover:text-amber-500'*/}
      {/*  )}*/}
      {/*/>*/}
      {isMaximized ? (
        <AgentTooltip
          content="Return chat window to normal size"
          side="right"
        >
          <ReduceWindowIcon
            onClick={reduceWindow}
            className={cn(
              'h-4 w-4 cursor-pointer hover:text-teal-500'
            )}
          />
        </AgentTooltip>
      ) : (
        <AgentTooltip
          content="Maximize the chat window to take all the available space"
          side="right"
        >
          <MaximizeIcon
            onClick={onMaximizeClick}
            className={cn(
              'h-4 w-4 cursor-pointer hover:text-teal-500 rotate-45'
            )}
          />
        </AgentTooltip>
      )}

      <AgentTooltip content="Close window" side="right">
        <CloseIcon
          onClick={toggle}
          className={cn(
            'h-5 w-5 cursor-pointer hover:text-red-500'
          )}
        />
      </AgentTooltip>
    </div>
  );
};
