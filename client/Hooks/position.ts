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
  width: string;
  height: string;
};

type TwoDCoord = {
  x: number;
  y: number;
};

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
  }, [] );

  const onDrag = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
      if ( chatWindowRef?.current ) {
        const { right, bottom } = chatWindowRef.current.getBoundingClientRect();
        setIsDragging( true );
        setMouseStartPos( { x: e.clientX, y: e.clientY } );
        setElementStartPos( { x: right, y: bottom } );
      }
    },
    [ chatWindowRef ],
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

  const handleResize = useCallback( () => {
    if ( chatWindowRef?.current ) {
      const { maxRight, maxBottom } = calculateBoundaries();

      setPosition( position => ( {
        right: Math.min( position.right, maxRight ),
        bottom: Math.min( position.bottom, maxBottom ),
      } ) );
    }
  }, [ chatWindowRef, calculateBoundaries ] );

  /**
   * Mouse Handler Listeners
   */
  useEffect( () => {
    document.addEventListener( 'mousemove', handleMove );
    document.addEventListener( 'mouseup', handleMouseUp );
    window.addEventListener( 'resize', handleResize );

    return () => {
      document.removeEventListener( 'mousemove', handleMove );
      document.removeEventListener( 'mouseup', handleMouseUp );
      window.removeEventListener( 'resize', handleResize );
    };
  }, [ handleMouseUp, handleMove, handleResize ] );

  /**
   * Persist to local settings
   */
  useEffect(
    () => setSettings( settings => ( { ...settings, ...position } ) ),
    [ position, setSettings ],
  );

  return {
    position,
    size,
    onDrag,
    isDragging,
  };
};
