import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import Conversation from './Convo/Conversation';
import Draggable from 'react-draggable';

export default function ChatContainer() {
  const { open } = useChat();
  const { settings, setSettings } = useClientSettings();
  const [ isHovering, setIsHovering ] = useState( false );

  const eventHandler = ( e, data ) => {
    console.log( 'Event Type', e.type );
    console.log( { e, data } );
  };

  console.log( 'settings', settings );
  return (
    <Draggable onDrag={ eventHandler } handle=".handle" bounds="html">
      <div
        onMouseEnter={ () => setIsHovering( true ) }
        onMouseLeave={ () => setIsHovering( false ) }
        className={ cn(
          'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl w-[400px] h-[600px] fixed bottom-4 right-4 z-[10000]',
          {
            'opacity-100': true,
            // 'opacity-100': open,
            // 'opacity-0': ! open,
          },
        ) }>
        <ChatTopBar />
        <Conversation />
        <WindowActions show={ isHovering } />
        { /* <DragHandles /> */ }
      </div>
    </Draggable>
  );
}
