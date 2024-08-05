import { usePage } from '@/Providers/PageProvider';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { cn } from '@/lib/utils';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import Conversation from './Convo/Conversation';
import { usePosition } from '@/Hooks/position';
import ResizeHandles from '@/Components/Chat/ResizeHandles/ResizeHandles';
import { useAnimate, ValueAnimationTransition } from 'framer-motion';
import ArrowRightIcon from '@material-design-icons/svg/outlined/keyboard_double_arrow_right.svg?react';
import PowerOffIcon from '@material-design-icons/svg/outlined/power_settings_new.svg?react';
import { Button } from '@/Components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuIcon,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/Components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import Logo from '../Logo';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useChat } from '@/Providers/ChatProvider';

const ChatUIContext = createContext( {
  toggle: () => {},
  open: false,
  setOpen: ( _open: boolean ) => {},
} );

export function useChatUI() {
  return useContext( ChatUIContext );
}

export default function Chat( { defaultOpen = false }: { defaultOpen?: boolean } ) {
  const { open, setOpen } = useChat();
  const chatTriggerRef = useRef< HTMLButtonElement >( null );
  const { updateSetting } = useClientSettings();
  const [ turnedOff, setTurnedOff ] = useState( settings.turnedOff );
  const { canAccessAgent } = usePage();
  const [ isHovering, setIsHovering ] = useState( false );
  const [ scope, animate ] = useAnimate();
  const [ isOpening, setIsOpening ] = useState( false );
  const [ isClosing, setIsClosing ] = useState( false );
  const [ shouldAnimate, setShouldAnimate ] = useState( false );
  const noTransition = { duration: 0 };
  const transition: ValueAnimationTransition = {
    type: 'spring',
    duration: 0.5,
    bounce: 0.25,
  };

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

  const triggerPosition = useMemo( () => {
    const el = chatTriggerRef.current?.getBoundingClientRect();
    if ( ! el ) return { bottom: 0, right: 0 };
    return { bottom: window.innerHeight - el.bottom, right: window.innerWidth - el.right };
  }, [ chatTriggerRef ] );

  const openedStyles = useMemo( () => {
    const styles = {
      scale: 1,
      borderRadius: '0.75rem',
      width: 'max(min(' + size.width + 'px' + ', 100vw), 400px)',
      height: 'max(min(' + size.height + 'px' + ', 100vh), 400px)',
      right: position.right + 'px',
      bottom: position.bottom + 'px',
      transform: `translate(${ size.offset.x }px, ${ size.offset.y }px)`,
    };

    if ( scope.current ) {
      const animation = shouldAnimate ? transition : noTransition;
      animate( scope.current, styles, animation );
    }

    return styles;
  }, [ size, position, scope, shouldAnimate ] );

  const closedStyles = useMemo(
    () => ( {
      scale: 0,
      borderRadius: '100%',
      width: 0,
      height: 0,
      transform: `translate(0, 0)`,
      ...triggerPosition,
    } ),
    [ triggerPosition ],
  );

  /**
   * Animate toggle
   */
  const toggle = useCallback( () => {
    const isOpen = ! open;
    setOpen( isOpen );
    if ( isOpen ) {
      setTurnedOff( false );
      updateSetting( 'turnedOff', false );
      setIsOpening( true );
      animate( scope.current, openedStyles, transition ).then( () => setIsOpening( false ) );
    } else {
      setIsClosing( true );
      animate( scope.current, closedStyles, {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5,
      } ).then( () => setIsClosing( false ) );
    }
    updateSetting( 'chatOpen', isOpen );
  }, [ scope, openedStyles, closedStyles, updateSetting, animate, transition ] );

  /**
   * Animate on mount
   */
  useEffect( () => {
    animate( scope.current, open ? openedStyles : closedStyles, { duration: 0 } );
  }, [] );

  useEffect( () => {
    if ( ! isMaximized ) {
      setShouldAnimate( false );
    }
  }, [ isMaximized ] );

  function handleTurnOff() {
    setTurnedOff( true );
    updateSetting( 'turnedOff', true );

    if ( open ) {
      toggle();
    }
  }

  function handleMaximize() {
    setShouldAnimate( true );
    maximizeWindow();
  }

  function handleRestore() {
    setShouldAnimate( true );
    restoreWindow();
  }

  return (
    canAccessAgent && (
      <ChatUIContext.Provider value={ { toggle, open, setOpen } }>
        <div
          ref={ scope }
          onMouseEnter={ () => setIsHovering( true ) }
          onMouseLeave={ () => setIsHovering( false ) }
          className={ cn(
            'bg-brand-gray shadow-xl transition-shadow duration-500 flex flex-col border-gray-200 rounded-xl fixed bottom-4 right-4 z-[10000] origin-bottom-right',
            {
              'user-select-none': isDragging,
              'overflow-hidden': isOpening || isClosing,
            },
          ) }>
          <WindowActions
            toggle={ toggle }
            handleDrag={ onDrag }
            onMouseEnter={ () => setIsHovering( true ) }
            show={ isHovering || isDragging }
            isMaximized={ isMaximized }
            maximizeWindow={ handleMaximize }
            restoreWindow={ handleRestore }
          />
          <ChatTopBar handleDrag={ onDrag } />
          <Conversation />
          <ResizeHandles resizeHandler={ onChatWindowResize } />
        </div>
        <ContextMenu>
          <ContextMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
          ref={ chatTriggerRef }
          onClick={ toggle }
          variant="ghost"
          className="fixed bottom-12 w-9 h-9 right-0 py-1 px-2 rounded-none rounded-l-lg transition bg-white justify-center items-center shadow-lg z-[10000]">
          { open ? <ArrowRightIcon /> : <Logo className="w-full" /> }
          <div className="absolute -top-4 -right-1 h-5 w-5 rounded-full border-b-4 border-white -rotate-45"></div>
          <div className="absolute -bottom-4 -right-1 h-5 w-5 rounded-full border-t-4 border-white rotate-45"></div>
        </Button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  <p>
                    { turnedOff ? (
                      <>
                        AgentWP is off.
                        <br /> Click to reinitialize.
                      </>
                    ) : open ? (
                      <>
                        Click to minimize
                        <br /> AgentWP.
                      </>
                    ) : (
                      <>
                        AgentWP is hidden.
                        <br /> Click to show.
                      </>
                    ) }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ContextMenuTrigger>
          { ! turnedOff && (
            <ContextMenuContent>
              <ContextMenuItem onClick={ () => handleTurnOff() } className={ 'text-sm' }>
                <ContextMenuIcon>
                  <PowerOffIcon />
                </ContextMenuIcon>
                Turn off
              </ContextMenuItem>
            </ContextMenuContent>
          ) }
        </ContextMenu>
      </>
      </ChatUIContext.Provider>
    )
  );
}
