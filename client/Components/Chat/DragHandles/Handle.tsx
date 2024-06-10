import { useEffect, useState } from 'react';
import { cn, getChatwindowElement } from '@/lib/utils';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { getDefaultWindowWidth } from '@/Shared/App';

type Props = {
  position: 'top' | 'right' | 'left' | 'bottom';
  className?: string;
  isShowing?: boolean;
};

export default function Handle( { position, className, isShowing = false }: Props ) {
  const { setSettings } = useClientSettings();
  const [ isFirstLoad, setIsFirstLoad ] = useState( false );

  function resizeStart( e: React.MouseEvent ) {
    e.preventDefault();
    const chatWindow = getChatwindowElement();
    if ( chatWindow.classList.contains( 'maximized' ) ) {
      return;
    }
    const chatWindowRect = chatWindow.getBoundingClientRect();
    const bodyElement = document.getElementsByTagName( 'body' )[ 0 ];
    const containerElement = document.getElementById( 'wpbody' );
    const maxWidth = containerElement.getBoundingClientRect().width - 60;
    const maxHeight = window.innerHeight - 50;

    const computedStyle = window.getComputedStyle( chatWindow );
    const matrix = new DOMMatrixReadOnly( computedStyle.transform );
    const startPosX = e.clientX;
    const startPosY = e.clientY;
    const initialWidth = chatWindowRect.width;
    const initialHeight = chatWindowRect.height;
    const initialWindowX = matrix.m41;
    const initialWindowY = matrix.m42;
    let lastWidth = chatWindowRect.width,
      lastHeight = chatWindowRect.height,
      lastTranslateX = initialWindowX,
      lastTranslateY = initialWindowY;

    function resize( target: HTMLDivElement, x: number, y: number ) {
      const displacedDistanceX = startPosX - x;
      const displacedDistanceY = startPosY - y;
      const calculatedMatrix = new DOMMatrixReadOnly( computedStyle.transform );
      let newWidth;
      let newHeight;
      let newTranslateX = calculatedMatrix.m41;
      let newTranslateY = calculatedMatrix.m42;

      switch ( position ) {
        case 'top':
          newHeight = initialHeight + displacedDistanceY;
          break;
        case 'bottom':
          newHeight = initialHeight - displacedDistanceY;
          newTranslateY = isWithinBounds( newHeight, 550, maxHeight )
            ? initialWindowY - ( startPosY - y )
            : newTranslateY;
          break;
        case 'left':
          newWidth = initialWidth + displacedDistanceX;
          newTranslateX = isWithinBounds( newWidth, getDefaultWindowWidth(), maxWidth )
            ? initialWindowX - ( startPosX - x )
            : newTranslateX;
          break;
        case 'right':
          newWidth = initialWidth - displacedDistanceX;
          newTranslateX = isWithinBounds( newWidth, getDefaultWindowWidth(), maxWidth )
            ? initialWindowX - ( startPosX - x )
            : newTranslateX;
          break;
      }

      // restrict based on upper and lower bounds
      if ( isWithinBounds( newWidth, getDefaultWindowWidth(), maxWidth ) ) {
        target.style.width = newWidth + 'px';
        lastWidth = newWidth;
      }
      if ( isWithinBounds( newHeight, 550, maxHeight ) ) {
        target.style.height = newHeight + 'px';
        lastHeight = newHeight;
      }
      lastTranslateX = newTranslateX;
      lastTranslateY = newTranslateY;
      target.style.transform = `translate(${ newTranslateX }px, ${ newTranslateY }px)`;
    }

    const handleResize = ( e: MouseEvent ) => {
      resize( chatWindow, e.clientX, e.clientY );
    };

    const isWithinBounds = ( value, min, max ): boolean => {
      return value > min && value < max;
    };

    const disableResize = () => {
      setSettings( {
        width: lastWidth,
        height: lastHeight,
        x: lastTranslateX,
        y: lastTranslateY,
      } );
      bodyElement.removeEventListener( 'mousemove', handleResize );
      bodyElement.onmouseup = null;
    };

    bodyElement.addEventListener( 'mousemove', handleResize );
    bodyElement.addEventListener( 'mouseup', disableResize );
  }

  const postionClasses = {
    left: 'cursor-col-resize w-4 left-0 top-0 bottom-0',
    right: 'cursor-col-resize w-4 right-0 top-0 bottom-0',
    bottom: 'cursor-row-resize h-4 bottom-0 left-0 right-0',
    top: 'cursor-row-resize h-4 top-0 left-0 right-0',
  };

  useEffect( () => {
    if ( isFirstLoad && isShowing ) {
      setIsFirstLoad( false );
    }
  }, [ isShowing ] );

  useEffect( () => {
    setIsFirstLoad( true );
  }, [] );

  return (
    <div
      className={ cn(
        'absolute transition-all bg-red-500 z-10',
        postionClasses[ position ],
        className,
      ) }
      onMouseDown={ resizeStart }></div>
  );
}
