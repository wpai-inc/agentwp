import { useCallback, useEffect, useState } from 'react';

type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type DragInfo = {
  startX: number;
  startY: number;
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ResizeHandler = ( width: number, height: number ) => void;

export const usePosition = ( { ref, calculateFor = 'topLeft' } ) => {
  const [ dragInfo, setDragInfo ] = useState< DragInfo >();
  const [ finalPosition, setFinalPosition ] = useState< Position >( {} );
  const [ isDragging, setIsDragging ] = useState( false );

  const handleResize = useCallback(
    ( width: number, height: number ) => {
      const { current: draggableElement } = ref;

      if ( ! draggableElement ) {
        return;
      }

      const { top, left } = draggableElement.getBoundingClientRect();

      updateFinalPosition( width, height, left, top );
    },
    [ ref ],
  );

  const updateFinalPosition = useCallback(
    ( width: number, height: number, x: number, y: number ) => {
      if ( calculateFor === 'bottomRight' ) {
        setFinalPosition( {
          x: Math.max(
            Math.min( window.innerWidth - width, window.innerWidth - ( x + width ) ),
            0,
          ),
          y: Math.max(
            Math.min( window.innerHeight - height, window.innerHeight - ( y + height ) ),
            0,
          ),
          w: width,
          h: height,
        } );

        return;
      }

      setFinalPosition( {
        x: Math.min( Math.max( 0, x ), window.innerWidth - width ),
        y: Math.min( Math.max( 0, y ), window.innerHeight - height ),
        w: width,
        h: height,
      } );
    },
    [ calculateFor ],
  );

  const handleMouseUp = ( evt: React.MouseEvent< HTMLDivElement > ) => {
    evt.preventDefault();

    setIsDragging( false );
  };

  const handleMouseDown = ( evt: React.MouseEvent< HTMLDivElement > ) => {
    evt.preventDefault();

    const { clientX, clientY } = evt;
    const { current: draggableElement } = ref;

    if ( ! draggableElement ) {
      return;
    }

    const { top, left, width, height } = draggableElement.getBoundingClientRect();

    setIsDragging( true );
    setDragInfo( {
      startX: clientX,
      startY: clientY,
      top,
      left,
      width,
      height,
    } );
  };

  const handleMouseMove = useCallback(
    evt => {
      const { current: draggableElement } = ref;

      if ( ! isDragging || ! draggableElement ) return;

      evt.preventDefault();

      const { clientX, clientY } = evt;

      const position = {
        x: dragInfo.startX - clientX,
        y: dragInfo.startY - clientY,
      };

      const { top, left, width, height } = dragInfo;

      updateFinalPosition( width, height, left - position.x, top - position.y );
    },
    [ isDragging, dragInfo, ref, updateFinalPosition ],
  );

  const recalculate = ( width: number, height: number ) => {
    const { current: draggableElement } = ref;
    const {
      top,
      left,
      width: boundingWidth,
      height: boundingHeight,
    } = draggableElement.getBoundingClientRect();

    updateFinalPosition( width ?? boundingWidth, height ?? boundingHeight, left, top );
  };

  useEffect( () => {
    document.addEventListener( 'mousemove', handleMouseMove );
    document.addEventListener( 'mouseup', handleMouseUp );

    return () => {
      document.removeEventListener( 'mousemove', handleMouseMove );
      document.removeEventListener( 'mouseup', handleMouseUp );
    };
  }, [ handleMouseMove ] );

  return {
    position: finalPosition,
    handleMouseDown,
    recalculate,
    handleResize,
    isDragging,
  };
};
