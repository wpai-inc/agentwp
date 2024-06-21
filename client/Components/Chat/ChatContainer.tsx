import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import Conversation from './Convo/Conversation';
import { usePosition } from '@/Hooks/position';
import ResizeHandles from '@/Components/Chat/ResizeHandles/ResizeHandles';

export default function ChatContainer() {
  const containerRef = useRef( null );
  const { position, handleMouseDown, handleResize } = usePosition( {
    ref: containerRef,
  } );
  const { open } = useChat();
  const { settings, setSettings } = useClientSettings();
  const [ isHovering, setIsHovering ] = useState( false );

  console.log( 'settings', settings );
  return (
    <div
      ref={ containerRef }
      onMouseEnter={ () => setIsHovering( true ) }
      onMouseLeave={ () => setIsHovering( false ) }
      style={ {
        top: position.y,
        left: position.x,
        width: position.w,
        height: position.h,
      } }
      className={ cn(
        'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl fixed bottom-4 right-4 z-[10000]',
        {
          'opacity-100': true,
          // 'opacity-100': open,
          // 'opacity-0': ! open,
        },
      ) }>
      <ChatTopBar dragHandler={ handleMouseDown } />
      <Conversation />
      <WindowActions show={ isHovering } />
      <ResizeHandles resizeHandler={ handleResize } />
    </div>
  );
}
