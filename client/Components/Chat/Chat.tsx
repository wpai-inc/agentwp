import { useChat } from '@/Providers/ChatProvider';
import { usePage } from '@/Providers/PageProvider';
import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import Conversation from './Convo/Conversation';
import { usePosition } from '@/Hooks/position';
import ResizeHandles from '@/Components/Chat/ResizeHandles/ResizeHandles';
import { useAnimate } from 'framer-motion';
import ArrowRightIcon from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import { Button } from '@/Components/ui/button';
import Logo from '../Logo';

export default function Chat() {
  const chatTriggerRef = useRef< HTMLButtonElement >( null );
  const { open, toggle } = useChat();
  const { canAccessAgent } = usePage();
  const [ isHovering, setIsHovering ] = useState( false );
  const [ scope, animate ] = useAnimate();
  const [ isOpening, setIsOpening ] = useState( false );
  const [ isClosing, setIsClosing ] = useState( false );

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
    chatWindowRef: scope,
  } );

  const isToggling = isOpening || isClosing;

  const onToggle = useCallback( () => {
    if ( open ) {
      setIsOpening( true );
      animate( scope.current, {
        scale: 1,
        borderRadius: '0.75rem',
        width: size.width,
        height: size.height,
        ...position,
      } ).then( () => setIsOpening( false ) );
    } else if ( chatTriggerRef.current ) {
      const el = chatTriggerRef.current.getBoundingClientRect();
      const bottom = window.innerHeight - el.bottom;
      const right = window.innerWidth - el.right;
      setIsClosing( true );
      animate( scope.current, {
        scale: 0,
        borderRadius: '1000rem',
        bottom,
        right,
        width: 0,
        height: 0,
      } ).then( () => setIsClosing( false ) );
    }
  }, [ open, size, scope, animate, position, chatTriggerRef ] );

  const handleToggle = useCallback( () => toggle( onToggle ), [ onToggle ] );

  return (
    canAccessAgent && (
      <>
        <div
          ref={ scope }
          onMouseEnter={ () => setIsHovering( true ) }
          onMouseLeave={ () => setIsHovering( false ) }
          style={ {
            right: position.right + 'px',
            bottom: position.bottom + 'px',
            width: 'max(min(' + size.width + 'px' + ', 100vw), 400px)',
            height: 'max(min(' + size.height + 'px' + ', 100vh), 400px)',
            transform: `translate(${ size.offset.x }px, ${ size.offset.y }px)`,
            transformOrigin: 'bottom right',
          } }
          className={ cn(
            'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl fixed bottom-4 right-4 z-[10000]',
            {
              'user-select-none': isDragging,
              'overflow-hidden': isToggling,
            },
          ) }>
          <WindowActions
            toggle={ handleToggle }
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
        <Button
          ref={ chatTriggerRef }
          onClick={ handleToggle }
          variant="ghost"
          className="fixed bottom-12 w-9 h-9 right-0 py-1 px-2 rounded-none rounded-l-lg transition bg-white justify-center items-center shadow-lg z-[10000]">
          { open ? <ArrowRightIcon /> : <Logo className="w-full" /> }
          <div className="absolute -top-4 -right-1 h-5 w-5 rounded-full border-b-4 border-white -rotate-45"></div>
          <div className="absolute -bottom-4 -right-1 h-5 w-5 rounded-full border-t-4 border-white rotate-45"></div>
        </Button>
      </>
    )
  );
}
