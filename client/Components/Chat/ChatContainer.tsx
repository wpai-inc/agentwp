import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import Conversation from './Convo/Conversation';
import { usePosition } from '@/Hooks/position';
import ResizeHandles from '@/Components/Chat/ResizeHandles/ResizeHandles';

export default function ChatContainer() {
  const containerRef = useRef< HTMLDivElement >( null );
  const {
    position,
    size,
    onDrag,
    isDragging,
    onChatWindowResize,
    maximizeWindow,
    isMaximized,
    restoreWindow,
  } = usePosition( {
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
        width: 'max(min(' + size.width + 'px' + ', 100vw), 400px)',
        height: 'max(min(' + size.height + 'px' + ', 100vh), 400px)',
        transform: `translate(${ size.offset.x }px, ${ size.offset.y }px)`,
      } }
      className={ cn(
        'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl fixed bottom-4 right-4 z-[10000]',
        {
          'opacity-100': true,
          'user-select-none': isDragging,
        },
      ) }>
      <WindowActions
        handleDrag={ onDrag }
        onMouseEnter={ () => setIsHovering( true ) }
        show={ isHovering || isDragging }
        maximizeWindow={ maximizeWindow }
        isMaximized={ isMaximized }
        restoreWindow={ restoreWindow }
      />
      <ChatTopBar handleDrag={ onDrag } />
      <Conversation />
      <ResizeHandles resizeHandler={ onChatWindowResize } />
    </div>
  );
}
