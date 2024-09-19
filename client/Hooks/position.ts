import { useEffect, useState, useCallback } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { animate } from 'framer-motion';

/**
 * Position is calculated as the distance of the bottom corner
 * of the element to the bottom right of the screen
 */
type ChatWindowPosition = {
  right: number;
  bottom: number;
};

type ChatWindowSize = {
  width: number;
  height: number;
};

export type TwoDCoord = {
  x: number;
  y: number;
};

export type ResizeSide = 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br';

export type ResizeHandler = ( width: number, height: number ) => void;

export const usePosition = ( {
  chatWindowRef,
}: {
  chatWindowRef: React.RefObject< HTMLDivElement >;
} ) => {
  const chatWindowEl = chatWindowRef.current;
  const chatWindowContainer = chatWindowEl?.parentElement || document.body;
  /**
   * State
   */
  const { settings, setSettings } = useClientSettings();
  const [ isDragging, setIsDragging ] = useState( false );
  const [ isResizing, setIsResizing ] = useState( false );
  const [ maximization, setMaximization ] = useState< {
    isMaximized: boolean;
    position: ChatWindowPosition;
    size: ChatWindowSize;
  } >();
  const [ resizeSide, setResizeSide ] = useState< ResizeSide >();
  const [ mouseStartPos, setMouseStartPos ] = useState< TwoDCoord >();
  const [ elementStartPos, setElementStartPos ] = useState< TwoDCoord >();
  const [ position, setPosition ] = useState< ChatWindowPosition >( {
    right: settings.right,
    bottom: settings.bottom,
  } );
  const [ size, setSize ] = useState< ChatWindowSize >( {
    width: settings.width,
    height: settings.height,
  } );
  const [ offset, setOffset ] = useState< TwoDCoord >( { x: 0, y: 0 } );

  /**
   * Calculate boundaries based on parent element and window size
   */
  const calculateBoundaries = useCallback( () => {
    if ( chatWindowContainer && chatWindowEl ) {
      const parentRect = chatWindowContainer.getBoundingClientRect();
      const { width, height } = chatWindowEl.getBoundingClientRect();
      const maxHeight = window.innerHeight - parentRect.top;
      const maxRight = Math.max( parentRect.width - width, 0 );
      const maxBottom = Math.max( maxHeight - height, 0 );

      return { maxRight, maxBottom, width: parentRect.width - 40, height: maxHeight - 40 };
    } else {
      return {
        maxRight: window.innerWidth,
        maxBottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  }, [ chatWindowEl, chatWindowContainer ] );

  /**
   * Handlers
   */
  const handleMouseUp = useCallback( () => {
    setIsDragging( false );
    setIsResizing( false );
  }, [] );

  const onDrag = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
      if ( chatWindowEl ) {
        const { right, bottom } = chatWindowEl.getBoundingClientRect();
        setIsDragging( true );
        setMouseStartPos( { x: e.clientX, y: e.clientY } );
        setElementStartPos( { x: right, y: bottom } );
      }
    },
    [ chatWindowEl, settings, size, setPosition ],
  );

  const handleMove = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
      if ( isDragging && chatWindowEl && mouseStartPos && elementStartPos ) {
        const dx = e.clientX - mouseStartPos.x;
        const dy = e.clientY - mouseStartPos.y;

        const newRight = Math.max( window.innerWidth - ( elementStartPos.x + dx ), 0 );
        const newBottom = Math.max( window.innerHeight - ( elementStartPos.y + dy ), 0 );

        const { maxRight, maxBottom } = calculateBoundaries();

        setPosition( {
          right: Math.min( Math.max( newRight, 0 ), maxRight ),
          bottom: Math.min( Math.max( newBottom, 0 ), maxBottom ),
        } );
      }
    },
    [ isDragging, chatWindowEl, mouseStartPos, elementStartPos, calculateBoundaries ],
  );

  const handleWindowResize = useCallback( () => {
    if ( chatWindowEl ) {
      const { maxRight, maxBottom } = calculateBoundaries();

      setPosition( position => ( {
        right: Math.min( position.right, maxRight ),
        bottom: Math.min( position.bottom, maxBottom ),
      } ) );
    }
  }, [ chatWindowEl, calculateBoundaries ] );

  const onChatWindowResize = useCallback(
    ( e: MouseEvent, side: ResizeSide ) => {
      e.preventDefault();
      if ( chatWindowEl ) {
        setIsResizing( true );
        setMouseStartPos( { x: e.clientX, y: e.clientY } );
        setElementStartPos( {
          x: chatWindowEl.offsetWidth,
          y: chatWindowEl.offsetHeight,
        } );
        setResizeSide( side );
        setMaximization( undefined );
      }
    },
    [ chatWindowEl ],
  );

  const handleResize = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
      if ( chatWindowEl ) {
        console.log( 'chatWindowEl Right side', chatWindowEl.getBoundingClientRect() );
      }
      if ( isResizing && chatWindowContainer && mouseStartPos && elementStartPos ) {
        const dx = e.clientX - mouseStartPos.x;
        const dy = e.clientY - mouseStartPos.y;

        let newWidth = elementStartPos.x;
        let newHeight = elementStartPos.y;

        // Modify size based on resize side
        switch ( resizeSide ) {
          case 't':
            newHeight = Math.max( elementStartPos.y - dy, 0 );
            break;
          case 'b':
            newHeight = Math.max( elementStartPos.y + dy, 0 );
            setOffset( offset => ( { ...offset, y: dy } ) );
            break;
          case 'l':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            break;
          case 'r':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            setOffset( offset => ( { ...offset, x: dx } ) );
            break;
          case 'tl':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            newHeight = Math.max( elementStartPos.y - dy, 0 );
            break;
          case 'tr':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            newHeight = Math.max( elementStartPos.y - dy, 0 );
            setOffset( { y: dy, x: dx } );
            break;
          case 'bl':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            newHeight = Math.max( elementStartPos.y + dy, 0 );
            break;
          case 'br':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            newHeight = Math.max( elementStartPos.y + dy, 0 );
            setOffset( { y: dy, x: dx } );
            break;
        }

        setSize( {
          width: newWidth,
          height: newHeight,
        } );
      }
    },
    [
      isResizing,
      resizeSide,
      mouseStartPos,
      elementStartPos,
      chatWindowContainer,
      setOffset,
      chatWindowEl,
    ],
  );

  /**
   * Recalculates the new position without the offset.
   */
  useEffect( () => {
    if ( ! isResizing ) {
      setPosition( position => ( {
        right: position.right - offset.x,
        bottom: position.bottom - offset.y,
      } ) );
      setOffset( { x: 0, y: 0 } );
    }
  }, [ offset, setPosition, isResizing ] );

  /**
   * Functions
   */
  const maximizeWindow = useCallback( () => {
    setMaximization( {
      isMaximized: true,
      position,
      size,
    } );
    const { width, height } = calculateBoundaries();
    setPosition( { right: 20, bottom: 20 } );
    setSize( { width, height } );
  }, [ position, size, calculateBoundaries, animate, chatWindowRef ] );

  const restoreWindow = useCallback( () => {
    if ( maximization ) {
      const { position, size } = maximization;
      setPosition( position );
      setSize( size );
      setMaximization( undefined );
    }
  }, [ maximization, position ] );

  const isMaximized = maximization?.isMaximized ? true : false;

  /**
   * Mouse Handler Listeners
   */
  useEffect( () => {
    if ( isDragging ) {
      document.addEventListener( 'mousemove', handleMove );
      document.addEventListener( 'mouseup', handleMouseUp );
    }

    if ( isResizing ) {
      document.addEventListener( 'mousemove', handleMove );
      document.addEventListener( 'mousemove', handleResize );
      document.addEventListener( 'mouseup', handleMouseUp );
    }

    window.addEventListener( 'resize', handleWindowResize );

    return () => {
      document.removeEventListener( 'mousemove', handleMove );
      document.removeEventListener( 'mousemove', handleResize );
      document.removeEventListener( 'mouseup', handleMouseUp );
      window.removeEventListener( 'resize', handleWindowResize );
    };
  }, [ handleMouseUp, handleMove, handleResize, handleWindowResize, isDragging, isResizing ] );

  /**
   * Persist to local settings
   */
  useEffect( () => {
    setSettings( settings => ( { ...settings, ...position, ...size } ) );
  }, [ position, setSettings, size, setSize ] );

  return {
    position,
    size,
    onDrag,
    onChatWindowResize,
    isDragging,
    isResizing,
    chatWindowContainer,
    maximizeWindow,
    restoreWindow,
    isMaximized,
    offset,
  };
};
