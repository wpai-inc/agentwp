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
  const minSize = { width: 400, height: 400 };
  const [ isMaximized, setIsMaximized ] = useState( false );

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

      const target = e.target as HTMLElement;
      if ( ! target || target.id !== 'topBarUpgradeBtn' ) {
        if ( chatWindowEl ) {
          const { right, bottom } = chatWindowEl.getBoundingClientRect();
          setIsDragging( true );
          setMouseStartPos( { x: e.clientX, y: e.clientY } );
          setElementStartPos( { x: right, y: bottom } );
        }
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
    if ( chatWindowEl && settings.chatOpen ) {
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
      }
    },
    [ chatWindowEl ],
  );

  const handleResize = useCallback(
    ( e: MouseEvent ) => {
      e.preventDefault();
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
            if ( newHeight > minSize.height ) {
              setOffset( offset => ( { ...offset, y: dy } ) );
            }

            break;
          case 'l':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            break;
          case 'r':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            if ( newWidth > minSize.width ) {
              setOffset( offset => ( { ...offset, x: dx } ) );
            }
            break;
          case 'tl':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            newHeight = Math.max( elementStartPos.y - dy, 0 );
            break;
          case 'tr':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            newHeight = Math.max( elementStartPos.y - dy, 0 );
            if ( newWidth > minSize.width ) {
              setOffset( offset => ( { ...offset, x: dx } ) );
            }
            break;
          case 'bl':
            newWidth = Math.max( elementStartPos.x - dx, 0 );
            newHeight = Math.max( elementStartPos.y + dy, 0 );
            if ( newHeight > minSize.height ) {
              setOffset( offset => ( { ...offset, y: dy } ) );
            }
            break;
          case 'br':
            newWidth = Math.max( elementStartPos.x + dx, 0 );
            newHeight = Math.max( elementStartPos.y + dy, 0 );
            if ( newHeight > minSize.height ) {
              setOffset( offset => ( { ...offset, y: dy } ) );
            }
            if ( newWidth > minSize.width ) {
              setOffset( offset => ( { ...offset, x: dx } ) );
            }
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
      const offsetPosition = {
        right: position.right - offset.x,
        bottom: position.bottom - offset.y,
      };

      // Only update the position if it has actually changed
      if ( offsetPosition.right !== position.right || offsetPosition.bottom !== position.bottom ) {
        setPosition( offsetPosition );
        setOffset( { x: 0, y: 0 } );
      }
    }
  }, [ offset, isResizing, position ] );

  const toggleMaximizeRestore = useCallback( () => {
    if ( checkIsMaximized() ) {
      const { position, size } = getMinimizeParams();
      setPosition( position );
      setSize( size );
      setMaximization( undefined );
    } else {
      setMaximization( {
        isMaximized: true,
        position,
        size,
      } );
      const { width, height } = calculateBoundaries();
      console.log( width, height );

      setPosition( { right: 20, bottom: 20 } );
      setSize( { width, height: height } );
    }
  }, [ position, size, calculateBoundaries, animate, chatWindowRef ] );

  const checkIsMaximized = () => {
    const { width, height } = calculateBoundaries();
    if ( Math.abs( size.width - width ) <= 5 && Math.abs( size.height - height ) <= 5 ) {
      return true;
    } else {
      return false;
    }
  };

  const getMinimizeParams = () => {
    const defaults = {
      position: { right: 16, bottom: 16 },
      size: { width: 400, height: 800 },
    };

    if ( ! maximization ) {
      return defaults;
    }

    const { width, height } = calculateBoundaries();
    const { size } = maximization;

    if ( size.width >= width && size.height >= height ) {
      return defaults;
    }

    return maximization;
  };

  const restoreDefultSize = () => {
    const defaults = {
      position: { right: 16, bottom: 16 },
      size: { width: 400, height: 800 },
    };
    setPosition( defaults.position );
    setSize( defaults.size );
  };

  useEffect( () => {
    setIsMaximized( checkIsMaximized() );
  }, [ size, calculateBoundaries, position ] );

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
    // @ts-ignore
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
    isMaximized,
    offset,
    minSize,
    toggleMaximizeRestore,
    restoreDefultSize,
  };
};
