import { useEffect, useState } from 'react';
import CloseIcon from '@material-design-icons/svg/outlined/close.svg?react';
import MaximizeIcon from '@material-design-icons/svg/outlined/open_with.svg?react';
import DragIcon from '@material-design-icons/svg/outlined/drag_indicator.svg?react';
import ReduceWindowIcon from '@material-design-icons/svg/outlined/close_fullscreen.svg?react';
import {
  cn,
  getChatwindowElement,
  isChatWindowMaximized,
  resetChatWindowPosition,
} from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';

const Corners = () => {
  return (
    <>
      <div
        className={ cn(
          'absolute -top-3 left-3 border-brand-gray',
          'min-h-4 w-4 rounded-br-full border-b-4 border-r-4',
        ) }></div>
      <div
        className={ cn(
          'absolute -bottom-3 left-3 border-brand-gray',
          'min-h-4 w-4 rounded-tr-full border-t-4 border-r-4',
        ) }></div>
    </>
  );
};

export default function WindowActions( { isShowing = false } ) {
  const { setSettings } = useClientSettings();
  const { toggle, isMaximized, maximizeChatWindow, reduceWindow } = useChat();
  const [ isFirstLoad, setIsFirstLoad ] = useState( false );
  const [ isDragging, setIsDragging ] = useState( false );

  function onMaximizeClick() {
    const element = getChatwindowElement();
    maximizeChatWindow( element );
  }

  function onDragDoubleClick( e ) {
    if ( isChatWindowMaximized() ) {
      return;
    }
    resetChatWindowPosition();
    setSettings( {
      x: 0,
      y: 0,
      width: null,
      height: null,
    } );
  }

  function startDrag( e ) {
    e.preventDefault();
    setIsDragging( true );
    const chatWindow = getChatwindowElement();
    if ( isChatWindowMaximized() ) {
      return;
    }
    const bodyElement = document.getElementsByTagName( 'body' )[ 0 ];
    const containerElement = document.getElementById( 'wpbody' );
    const containerCoords = containerElement.getBoundingClientRect();
    const initialMousePositionX = e.clientX;
    const initialMousePositionY = e.clientY;
    const computedStyle = window.getComputedStyle( chatWindow );
    const matrix = new DOMMatrixReadOnly( computedStyle.transform );

    const initialPositionX = matrix.m41;
    const initialPositionY = matrix.m42;
    let lastPositionX = matrix.m41;
    let lastPositionY = matrix.m42;

    let startPosX = e.clientX - chatWindow.getBoundingClientRect().left;
    let startPosY = e.clientY - chatWindow.getBoundingClientRect().top;

    const disableDrag = e => {
      setSettings( {
        x: lastPositionX,
        y: lastPositionY,
      } );
      setIsDragging( false );
      bodyElement.removeEventListener( 'mousemove', handleDrag );
      bodyElement.onmouseup = null;
    };

    const drag = ( target, x, y ) => {
      const chatWindowCoords = target.getBoundingClientRect();
      const currentPositionMatrix = new DOMMatrixReadOnly( computedStyle.transform );

      // check if any of the new bounding rects are out of bounds
      const newPositionLeft = x - startPosX;
      const newPositionRight = x - startPosX + chatWindowCoords.width;
      const newPositionTop = y - startPosY;
      const newPositionBottom = y - startPosY + chatWindowCoords.height;
      const leftOutOfBounds = newPositionLeft < containerCoords.left;
      const rightOutOfBounds = newPositionRight > containerCoords.right;
      const topOutOfBounds = newPositionTop < containerCoords.top;
      const bottomOutOfBounds = newPositionBottom > window.innerHeight;

      let newCoordsX = currentPositionMatrix.m41;
      let newCoordsY = currentPositionMatrix.m42;

      if ( ! leftOutOfBounds && ! rightOutOfBounds ) {
        newCoordsX = x - initialMousePositionX + initialPositionX;
      }

      if ( ! topOutOfBounds && ! bottomOutOfBounds ) {
        newCoordsY = y - initialMousePositionY + initialPositionY;
      }

      target.style.transform = `translate(${ newCoordsX }px, ${ newCoordsY }px)`;
      lastPositionX = newCoordsX;
      lastPositionY = newCoordsY;
    };

    const handleDrag = e => {
      drag( chatWindow, e.clientX, e.clientY );
    };

    bodyElement.addEventListener( 'mousemove', handleDrag );
    bodyElement.addEventListener( 'mouseup', disableDrag );
  }

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
        'absolute bg-brand-gray h-20 w-6 top-16',
        'flex flex-col items-center justify-center gap-2',
        'rounded-bl-lg rounded-tl-lg',
        {
          'opacity-0': isFirstLoad,
          'animate-slide-in': isShowing || isDragging,
          'animate-slide-out': ! isShowing && ! isFirstLoad && ! isDragging,
        },
      ) }>
      <AgentTooltip content="Drag or double-click to reset window position" side="right">
        <DragIcon
          id="drag-icon"
          onMouseDown={ startDrag }
          onDoubleClick={ onDragDoubleClick }
          className={ cn( 'h-6 w-6 hover:text-amber-500 cursor-move', 'text-gray-400' ) }
        />
      </AgentTooltip>
      { isMaximized ? (
        <AgentTooltip content="Return chat window to normal size" side="right">
          <ReduceWindowIcon
            onClick={ reduceWindow }
            className={ cn( 'h-4 w-4 cursor-pointer hover:text-teal-500', 'text-gray-400' ) }
          />
        </AgentTooltip>
      ) : (
        <AgentTooltip
          content="Maximize the chat window to take all the available space"
          side="right">
          <MaximizeIcon
            onClick={ onMaximizeClick }
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
