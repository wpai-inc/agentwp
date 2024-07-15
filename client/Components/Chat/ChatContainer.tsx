import React, { useEffect, useRef, useState } from 'react';
import { cn, getScreenBottomEdge } from '@/lib/utils';
import { SizeType, useChat } from '@/Providers/ChatProvider';
import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from './MessageBox/MessageBox';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import DragHandles from '@/Components/Chat/DragHandles/DragHandles';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { usePage } from '@/Providers/PageProvider';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { DraggableData, Rnd, RndDragCallback } from 'react-rnd';
import { DraggableEvent } from 'react-draggable';
import { ResizeDirection } from 're-resizable';

const unecessaryResizeHandlerStyles: React.CSSProperties = {
  display: 'none',
};

export default function ChatContainer() {
  const windowRef = useRef< HTMLDivElement >( null );
  const {
    minimizing,
    expanding,
    maximizing,
    reducing,
    isMaximized,
    position,
    setPosition,
    chatRef,
    size,
    setSize,
  } = useChat();
  const { settings, setSettings } = useClientSettings();
  const { conversation, chatSetting } = useChat();
  const [ isHovering, setIsHovering ] = useState( false );
  const { loadingConversation } = useUserRequests();
  const { page } = usePage();

  const onMouseEnter = () => {
    setIsHovering( true );
  };

  const onMouseLeave = () => {
    setIsHovering( false );
  };

  const handleScroll = () => {
    const windowElement = windowRef.current;
    if ( windowElement ) {
      windowElement.style.transform = `translate(0px, ${ window.scrollY }px)`;
    }
  };

  const onDrag = ( event: MouseEvent, data: { x?: number; y?: number } ) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const contentEl = document.getElementById( 'wpbody-content' );
    if ( ! contentEl ) return;

    const chatEl = document.getElementById( 'awp-chat' );
    if ( ! chatEl ) return;

    const contentRect = contentEl.getBoundingClientRect();
    const chatRect = chatEl.getBoundingClientRect();

    const leftLimit = contentRect.left + 5;
    const topLimit = contentRect.top + 5;
    const rightLimit = contentRect.right - 15;
    const bottomLimit = getScreenBottomEdge() - 5;

    const leftIsInside = chatRect.left > leftLimit;
    const topIsInside = chatRect.top > topLimit;
    const rightIsInside = chatRect.right < rightLimit;
    const bottomIsInside = chatRect.bottom < bottomLimit;

    let outOfBound = false;

    if ( ! leftIsInside ) {
      data.x = ( data.x ?? 0 ) + 5;
      outOfBound = true;
    }
    if ( ! rightIsInside ) {
      data.x = ( data.x ?? 0 ) - 5;
      outOfBound = true;
    }
    if ( ! bottomIsInside ) {
      data.y = ( data.y ?? 0 ) - 5;
      outOfBound = true;
    }
    if ( ! topIsInside ) {
      data.y = ( data.y ?? 0 ) + 5;
      outOfBound = true;
    }
    if ( outOfBound )
      chatRef?.current?.draggable.setState( ( state: any ) => ( { ...state, dragged: false } ) );
    setPosition( { x: data.x, y: data.y } );
  };

  const onDragStop = ( _e: DraggableEvent, { x, y }: DraggableData ) => {
    setSettings( {
      ...settings,
      x,
      y,
    } );
  };

  const onResizeStop = (
    _e: MouseEvent | TouchEvent,
    _dir: ResizeDirection,
    _elementRef: HTMLElement,
  ) => {
    setSettings( {
      ...settings,
      width: _elementRef.style.width,
      height: _elementRef.style.height,
    } );
  };

  const onResize = (
    _e: MouseEvent | TouchEvent,
    _dir: ResizeDirection,
    _elementRef: HTMLElement,
  ) => {
    setSize( {
      width: _elementRef.style.width,
      height: _elementRef.style.height,
    } );
  };

  useEffect( () => {
    window.addEventListener( 'scroll', handleScroll );

    return () => {
      window.removeEventListener( 'scroll', handleScroll );
    };
  }, [ settings.x, settings.y ] );

  console.log( 'RENDER ', { position, chatRef } );
  return (
    <Rnd
      id="awp-chat-rnd"
      ref={ chatRef }
      default={ {
        y: settings.y,
        x: settings.x,
        width: settings.width,
        height: settings.height,
      } }
      position={ position as { x: number; y: number } }
      size={
        size as {
          width: string | number;
          height: string | number;
        }
      }
      onResize={ onResize }
      onResizeStop={ onResizeStop }
      minHeight={ 500 }
      minWidth={ 400 }
      onDragStop={ onDragStop }
      onDrag={ onDrag as RndDragCallback }
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
      dragHandleClassName="handle"
      resizeHandleStyles={ {
        top: unecessaryResizeHandlerStyles,
        bottom: unecessaryResizeHandlerStyles,
        right: unecessaryResizeHandlerStyles,
        left: unecessaryResizeHandlerStyles,
      } }
      resizeHandleClasses={ {
        bottomLeft: 'resize-handler',
        bottomRight: 'resize-handler',
        topLeft: 'resize-handler',
        topRight: 'resize-handler',
      } }>
      <div
        ref={ windowRef }
        id="awp-chat"
        className={ cn(
          'h-full',
          'z-[100000] bg-brand-gray',
          'shadow-xl transition-shadow duration-100 flex flex-col',
          'border-gray-200 rounded-xl opacity-100',
          {
            'w-0 h-0 overflow-hidden border-0': ! open,
            'minimize': minimizing,
            'expand': expanding,
            'maximize shadow-3xl': maximizing,
            'maximized shadow-3xl': isMaximized,
            'reduce shadow-xl': reducing,
          },
        ) }>
        <div className="minimize-overlay" />
        <ChatTopBar />
        <div className="flex-1 flex flex-col relative overflow-auto">
          { loadingConversation ? (
            <LoadingScreen />
          ) : (
            <>
              <Dialog conversation={ conversation } />
              <div className="relative">
                <div
                  className={ cn(
                    'absolute -top-12 right-0 left-0 z-10 h-12 from-brand-gray to-transparent bg-gradient-to-t',
                  ) }></div>
                <div className="p-1.5">
                  { page.onboarding_completed && page.agentwp_access && <MessageBox /> }
                </div>
              </div>
              { chatSetting && (
                <ChatOverlay header={ chatSetting?.header }>{ chatSetting?.component }</ChatOverlay>
              ) }
            </>
          ) }
        </div>
        <WindowActions isShowing={ isHovering } chatRef={ chatRef } />
        { ! maximizing && ! isMaximized && <DragHandles isShowing={ isHovering } /> }
      </div>
    </Rnd>
  );
}
