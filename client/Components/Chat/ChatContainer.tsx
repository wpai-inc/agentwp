import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import Conversation from './Convo/Conversation';
import { usePosition } from '@/Hooks/position';
import ResizeHandles from '@/Components/Chat/ResizeHandles/ResizeHandles';

export default function ChatContainer() {
  const containerRef = useRef< HTMLDivElement >( null );
  const { position, size, onDrag, isDragging } = usePosition( {
    chatWindowRef: containerRef,
  } );
  const [ isHovering, setIsHovering ] = useState( false );

  return (
    <div
      ref={ containerRef }
      onMouseEnter={ () => setIsHovering( true ) }
      onMouseLeave={ () => setIsHovering( false ) }
      style={ {
        right: position.right + 'px',
        bottom: position.bottom + 'px',
        width: size.width,
        height: size.height,
      } }
      className={ cn(
        'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl fixed bottom-4 right-4 z-[10000]',
        {
          'opacity-100': true,
          'user-select-none': isDragging,
        },
      ) }>
      <ChatTopBar handleDrag={ onDrag } />
      <Conversation />
      <WindowActions
        handleDrag={ onDrag }
        onMouseEnter={ () => setIsHovering( true ) }
        show={ isHovering || isDragging }
      />
      <ResizeHandles resizeHandler={ () => {} } />
    </div>
  );
}
