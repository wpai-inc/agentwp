import { useEffect, useRef, useState } from 'react';
import { cn, resetChatWindowPosition } from "@/lib/utils";
import { useChat } from '@/Providers/ChatProvider';
import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from './MessageBox/MessageBox';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import DragHandles from '@/Components/Chat/DragHandles/DragHandles';

export default function ChatContainer() {
  const windowRef = useRef< HTMLDivElement >( null );
  const { open, minimizing, expanding, maximizing, reducing, isMaximized } = useChat();
  const { settings, setSettings } = useClientSettings();
  const { conversation, overlayChildren } = useChat();
  const [isHovering, setIsHovering] = useState(false);

  function onMouseEnter() {
    setIsHovering(true);
  }

  function onMouseLeave() {
    setIsHovering(false);
  }

  useEffect( () => {
    const windowElement = windowRef.current;
    if ( windowElement ) {
      windowElement.style.transform = `translate(${ settings.x }px, ${ settings.y }px)`;
      windowElement.style.width = settings.width + 'px';
      windowElement.style.height = settings.height + 'px';

      const resetChatWindow = () => {
        resetChatWindowPosition();
        setSettings( {
          x: 0,
          y: 0,
        } );
      };

      window.addEventListener( 'resize', resetChatWindow );

      return () => {
        window.removeEventListener( 'resize', resetChatWindow );
      };
    }
  }, [] );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={ windowRef }
      id="awp-chat"
      className={ cn(
        'fixed bottom-4 right-10',
        'h-[90vh] w-[400px]',
        'z-[999] bg-brand-gray',
        'shadow-xl transition-shadow duration-500 flex flex-col',
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
      <div className="minimize-overlay"></div>
      <ChatTopBar />
      <div className="flex-1 flex flex-col relative overflow-auto">
        <Dialog conversation={ conversation } />
        <div className={cn(
          'w-full bg-brand-gray chat-bottom-inner-shadow'
        )}></div>
        <div className="p-1.5">
          <MessageBox />
        </div>
        { overlayChildren && <ChatOverlay>{ overlayChildren }</ChatOverlay> }
      </div>
      <WindowActions isShowing={isHovering} />
      { !maximizing && !isMaximized && <DragHandles isShowing={isHovering} /> }
    </div>
  );
}
