import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import Conversation from './Convo/Conversation';
import { Rnd } from 'react-rnd';

export default function ChatContainer() {
  const { open } = useChat();
  const { settings, setSettings } = useClientSettings();
  const [ isHovering, setIsHovering ] = useState( false );

  const [ state, setState ] = useState( {
    width: 200,
    height: 200,
    x: 10,
    y: 10,
  } );
  console.log( 'settings', settings );
  return (
    <Rnd
      size={ { width: state.width, height: state.height } }
      position={ { x: state.x, y: state.y } }
      onDragStop={ ( e, d ) => {
        setState( { x: d.x, y: d.y } );
      } }
      onResizeStop={ ( e, direction, ref, delta, position ) => {
        setState( {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        } );
      } }>
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
    </Rnd>
  );
}
