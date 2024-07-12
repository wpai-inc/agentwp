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

export default function ChatContainer() {
  const chatRef = useRef< React.LegacyRef< Rnd > | undefined >( null );
  const [ chatPosition, setChatPosition ] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >();
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
    const contentEl = document.getElementById( 'wpbody' );
    if ( ! contentEl ) return;

    const chatEl = document.getElementById( 'awp-chat' );
    if ( ! chatEl ) return;

    const contentRect = contentEl.getBoundingClientRect();
    const chatRect = chatEl.getBoundingClientRect();

    const isOver =
      chatRect.left >= contentRect.left + 20 &&
      chatRect.right <= contentRect.right &&
      chatRect.top >= contentRect.top + 10 &&
      chatRect.bottom <= contentRect.bottom;

    if ( isOver ) {
      setChatPosition( { x: data.x, y: data.y } );
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onDragStop = () => {
    setSettings( {
      ...settings,
      x: chatPosition?.x as number,
      y: chatPosition?.y as number,
    } );
  };

  useEffect( () => {
    window.addEventListener( 'scroll', handleScroll );

    return () => {
      window.removeEventListener( 'scroll', handleScroll );
    };
  }, [ settings.x, settings.y ] );
  // console.log(`RENDER ===> isMouseInsideContentArea=${ isMouseInsideContentArea } X=${ settings.x }, Y=${ settings.y }, W=${ settings.width }, H=${ settings.height }`,{ minimizing, expanding, maximizing, reducing, isMaximized });

  return (
    <Rnd
      ref={ chatRef }
      position={ chatPosition }
      default={ {
        y: settings.y,
        x: settings.x,
        width: settings.width,
        height: settings.height,
      } }
      minHeight={ 500 }
      minWidth={ 400 }
      onDragStop={ onDragStop }
      onDrag={ onDrag as RndDragCallback }
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
      onResizeStop={ ( _e, _direction, ref ) => {
        setSettings( {
          ...settings,
          width: parseInt( ref.style.width, 10 ),
          height: parseInt( ref.style.height, 10 ),
        } );
      } }
      dragHandleClassName="handle">
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
