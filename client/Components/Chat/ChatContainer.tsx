import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
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

const unecessaryResizeHandlerStyles: React.CSSProperties = {
  display: 'none',
};
export default function ChatContainer() {
  const [ position, setPosition ] = useState< { x: number; y: number } | undefined >();
  const chatRef: React.LegacyRef< Rnd > = useRef( null );
  const windowRef = useRef< HTMLDivElement >( null );
  const { minimizing, expanding, maximizing, reducing, isMaximized } = useChat();
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

  const onDrag = ( event: MouseEvent, data: DraggableData ) => {
    event.preventDefault();
    if ( ! position?.x && ! position?.y ) return;
    const contentEl = document.getElementById( 'wpbody-content' );
    if ( ! contentEl ) return;

    const chatEl = document.getElementById( 'awp-chat' );
    if ( ! chatEl ) return;

    const contentRect = contentEl.getBoundingClientRect();
    const chatRect = chatEl.getBoundingClientRect();

    const leftLimit = contentRect.left + 30;
    const topLimit = contentRect.top + 5;
    const rightLimit = contentRect.right;
    const bottomLimit = contentRect.bottom - 5;

    const leftIsInside = chatRect.left > leftLimit;
    const topIsInside = chatRect.top > topLimit;
    const rightIsInside = chatRect.right < rightLimit;
    const bottomIsInside = chatRect.bottom < bottomLimit;

    if ( ! leftIsInside || ! rightIsInside ) data.x = position.x;

    if ( ! bottomIsInside || ! topIsInside ) data.y = position.y;
    setPosition( { x: data.x, y: data.y } );
  };

  const onDragStop = ( _e: DraggableEvent, { x, y }: DraggableData ) => {
    setSettings( {
      ...settings,
      x,
      y,
    } );
  };

  useEffect( () => {
    window.addEventListener( 'scroll', handleScroll );

    return () => {
      window.removeEventListener( 'scroll', handleScroll );
    };
  }, [ settings.x, settings.y ] );

  // console.log( `RENDER ===> x=${ position?.x }, y=${ position?.y }`, {current: chatRef.current,} );
  return (
    <Rnd
      ref={ chatRef }
      default={ {
        y: settings.y,
        x: settings.x,
        width: settings.width,
        height: settings.height,
      } }
      position={ position }
      minHeight={ 500 }
      minWidth={ 400 }
      onDragStop={ onDragStop }
      onDrag={ onDrag as RndDragCallback }
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
      dragHandleClassName="handle"
      // bounds={ contentEl }
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
        <WindowActions isShowing={ isHovering } />
        { ! maximizing && ! isMaximized && <DragHandles isShowing={ isHovering } /> }
      </div>
    </Rnd>
  );
}
