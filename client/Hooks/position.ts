import { useEffect, useState, useCallback } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

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
  offset: TwoDCoord;
};

export type TwoDCoord = {
  x: number;
  y: number;
};

export type ResizeSide = 'top' | 'bottom' | 'left' | 'right';

export type ResizeHandler = ( width: number, height: number ) => void;

export const usePosition = ( {
  chatWindowRef,
}: {
  chatWindowRef: React.RefObject< HTMLDivElement >;
} ) => {
  /**
   * State
   */
  const { settings, setSettings } = useClientSettings();
  const [ isDragging, setIsDragging ] = useState( false );
  const [ isResizing, setIsResizing ] = useState( false );
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
    offset: settings.offset,
  } );

  /**
   * Calculate boundaries based on parent element and window size
   */
  const calculateBoundaries = useCallback( () => {
    let maxRight = window.innerWidth;
    let maxBottom = window.innerHeight;

    if ( chatWindowRef?.current?.parentElement ) {
      const parentRect = chatWindowRef.current.parentElement.getBoundingClientRect();
      const { width, height } = chatWindowRef.current.getBoundingClientRect();
      maxRight = Math.max( parentRect.width - width, 0 );
      maxBottom = Math.max( window.innerHeight - parentRect.top - height, 0 );
    }

    return { maxRight, maxBottom };
  }, [ chatWindowRef ] );

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
      if ( chatWindowRef?.current ) {
        const { right, bottom } = chatWindowRef.current.getBoundingClientRect();
        setIsDragging( true );
        setMouseStartPos( { x: e.clientX, y: e.clientY } );
        setElementStartPos( { x: right, y: bottom } );
        setPosition( position => ( {
          right: position.right + size.offset.x,
          bottom: position.bottom + size.offset.y,
        } ) );
        setSize( { ...size, offset: { x: 0, y: 0 } } );
      }
    },
    [ chatWindowRef, settings, size, setPosition ],
  );

  const handleMove = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
      if ( isDragging && chatWindowRef?.current && mouseStartPos && elementStartPos ) {
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
    [ isDragging, chatWindowRef, mouseStartPos, elementStartPos, calculateBoundaries ],
  );

  const handleWindowResize = useCallback( () => {
    if ( chatWindowRef?.current ) {
      const { maxRight, maxBottom } = calculateBoundaries();

      setPosition( position => ( {
        right: Math.min( position.right, maxRight ),
        bottom: Math.min( position.bottom, maxBottom ),
      } ) );
    }
  }, [ chatWindowRef, calculateBoundaries ] );

  const onChatWindowResize = useCallback(
    ( e: MouseEvent, side: ResizeSide ) => {
      e.preventDefault();
      if ( chatWindowRef?.current ) {
        setIsResizing( true );
        setMouseStartPos( { x: e.clientX, y: e.clientY } );
        setElementStartPos( {
          x: chatWindowRef.current.offsetWidth,
          y: chatWindowRef.current.offsetHeight,
        } );
        setResizeSide( side );
      }
    },
    [ chatWindowRef ],
  );

  const handleResize = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
      if ( isResizing && chatWindowRef?.current && mouseStartPos && elementStartPos ) {
        // Abondon resize if mouse is outside of boundaries
        const container = chatWindowRef?.current?.parentElement || document.body;
        const parentRect = container.getBoundingClientRect();

        if (
          e.clientX > window.innerWidth ||
          e.clientY > window.innerHeight ||
          e.clientX < parentRect?.left ||
          e.clientY < parentRect?.top
        ) {
          return;
        }

        const dx = e.clientX - mouseStartPos.x;
        const dy = e.clientY - mouseStartPos.y;

        let newWidth = elementStartPos.x;
        let newHeight = elementStartPos.y;
        let offset = size.offset;

        switch ( resizeSide ) {
          case 'top':
            newHeight = Math.max( elementStartPos.y - dy, 0 );
            break;
          case 'bottom':
            newHeight = Math.max( elementStartPos.y + dy, 0 );
            offset.y = dy;
            break;
          case 'left':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            break;
          case 'right':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            offset.x = dx;
            break;
        }
        setSize( {
          width: newWidth,
          height: newHeight,
          offset,
        } );
      }
    },
    [
      isResizing,
      resizeSide,
      size,
      setSize,
      mouseStartPos,
      elementStartPos,
      setPosition,
      position,
    ],
  );

  /**
   * Mouse Handler Listeners
   */
  useEffect( () => {
    if ( isDragging || isResizing ) {
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
  };
};
