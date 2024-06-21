import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
// import DragHandles from '@/Components/Chat/DragHandles/DragHandles';
import Conversation from './Convo/Conversation';
import { Rnd } from 'react-rnd';

export default function ChatContainer() {
  const { open, maximizing, reducing, isMaximized } = useChat();
  const { settings, setSettings } = useClientSettings();
  const [ isHovering, setIsHovering ] = useState( false );

  console.log( 'settings', settings );
  return (
    <Rnd
      size={ { width: settings.width, height: settings.height } }
      bounds="window"
      position={ { x: settings.x, y: settings.y } }
      onDragStop={ ( e, d ) => {
        setSettings( prev => ( { ...prev, x: d.x, y: d.y } ) );
      } }
      className="fixed bottom-4 right-10 z-[100000]"
      dragHandleClassName="draggable"
      onResizeStop={ ( e, direction, ref, delta, position ) => {
        setSettings( {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        } );
      } }>
      <div
        onMouseEnter={ () => setIsHovering( true ) }
        onMouseLeave={ () => setIsHovering( false ) }
        className={ cn(
          'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl',
          {
            'opacity-100': open,
            'opacity-0': ! open,
          },
        ) }>
        <ChatTopBar />
        <Conversation />
        <WindowActions show={ isHovering } />
        { /* <DragHandles /> */ }
      </div>
    </Rnd>
  );
}
