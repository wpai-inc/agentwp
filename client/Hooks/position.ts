import { useEffect, useState } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

/**
 * Position is caculated as the distance of the bottom corner
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
  const [ position, setPosition ] = useState< ChatWindowPosition >( {
    right: settings.right,
    bottom: settings.bottom,
  } );
  const [ size, setSize ] = useState< ChatWindowSize >( {
    width: settings.width,
    height: settings.height,
  } );

  /**
   * Mouse Handler Listeners
   */
  useEffect( () => {
    document.addEventListener( 'mousemove', handleDrag );
    document.addEventListener( 'mouseup', handleMouseUp );
    document.addEventListener( 'mousedown', handleMouseDown );

    return () => {
      document.removeEventListener( 'mousemove', handleDrag );
      document.removeEventListener( 'mouseup', handleMouseUp );
      document.removeEventListener( 'mousedown', handleMouseDown );
    };
  }, [ handleDrag, handleMouseUp ] );

  /**
   * Persist to local settings
   */
  useEffect( () => setSettings( settings => ( { ...settings, ...position } ) ), [ position ] );

  function handleMouseUp() {
    setIsDragging( false );
  }

  function handleMouseDown() {
    setIsDragging( true );
  }

  function handleDrag( e ) {
    e.preventDefault();
    if ( isDragging ) {
      console.log( 'handleDrag' );
      trackPosition();
    }
  }

  function trackPosition() {
    if ( chatWindowRef?.current ) {
      const { top, left, width, height } = chatWindowRef.current.getBoundingClientRect();

      console.log( 'topPOS', top );
      setPosition( {
        right: Math.max( window.innerWidth - left - width, 0 ),
        bottom: Math.max( window.innerHeight - top - height, 0 ),
      } );
    }
  }

  return {
    position,
    size,
    handleDrag,
    isDragging,
  };
};
