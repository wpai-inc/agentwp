import React, { useEffect, useState } from 'react';
import { cn, getChatwindowElement } from '@/lib/utils';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { getDefaultWindowWidth } from '@/Shared/App';

type Props = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  isShowing?: boolean,
}

export default function Handle({
  position,
  className,
  isShowing = false,
}: Props) {
  const { setSettings } = useClientSettings();
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  function resizeStart(e) {
    e.preventDefault();
    const chatWindow = getChatwindowElement();
    if (chatWindow.classList.contains('maximized')) {
      return;
    }
    const chatWindowRect = chatWindow.getBoundingClientRect();
    const bodyElement = document.getElementsByTagName('body')[0];
    const containerElement = document.getElementById('wpbody');
    const maxWidth = containerElement.getBoundingClientRect().width - 60;
    const maxHeight = containerElement.getBoundingClientRect().height - 100;

    const computedStyle = window.getComputedStyle(chatWindow);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);
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

    const resize = (target, x, y) => {
      const displacedDistanceX = startPosX - x;
      const displacedDistanceY = startPosY - y;
      const calculatedMatrix = new DOMMatrixReadOnly(computedStyle.transform);
      let newWidth;
      let newHeight;
      let newTranslateX = calculatedMatrix.m41;
      let newTranslateY = calculatedMatrix.m42;

      if (position === 'top-left') {
        newWidth = initialWidth + displacedDistanceX;
        newHeight = initialHeight + displacedDistanceY;
      } else if (position === 'top-right') {
        newWidth = initialWidth - displacedDistanceX;
        newHeight = initialHeight + displacedDistanceY;
        newTranslateX = isWithinBounds(newWidth, getDefaultWindowWidth(), maxWidth)
          ? initialWindowX - (startPosX - x) : newTranslateX;
      } else if (position === 'bottom-left') {
        newWidth = initialWidth + displacedDistanceX;
        newHeight = initialHeight - displacedDistanceY;
        newTranslateY = isWithinBounds(newHeight, 650, maxHeight)
          ? initialWindowY - (startPosY - y) : newTranslateY;
      } else if (position === 'bottom-right') {
        newWidth = initialWidth - displacedDistanceX;
        newHeight = initialHeight - displacedDistanceY;
        newTranslateX = isWithinBounds(newWidth, getDefaultWindowWidth(), maxWidth)
          ? initialWindowX - (startPosX - x) : newTranslateX;
        newTranslateY = isWithinBounds(newHeight, 650, maxHeight)
          ? initialWindowY - (startPosY - y) : newTranslateY;
      }
      // restrict based on upper and lower bounds
      if (isWithinBounds(newWidth, getDefaultWindowWidth(), maxWidth)) {
        target.style.width = newWidth + 'px';
        lastWidth = newWidth;
      }
      if (isWithinBounds(newHeight, 650, maxHeight)) {
        target.style.height = newHeight + 'px';
        lastHeight = newHeight;
      }
      lastTranslateX = newTranslateX;
      lastTranslateY = newTranslateY;
      target.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
    }

    const handleResize = (e) => {
      resize(chatWindow, e.clientX, e.clientY);
    }

    const isWithinBounds = (value, min, max): boolean => {
      return value > min && value < max;
    }

    const disableResize = () => {
      setSettings({
        width: lastWidth,
        height: lastHeight,
        x: lastTranslateX,
        y: lastTranslateY,
      });
      bodyElement.removeEventListener('mousemove', handleResize);
      bodyElement.onmouseup = null;
    }

    bodyElement.addEventListener('mousemove', handleResize);
    bodyElement.addEventListener('mouseup', disableResize);
  }

  const postionClasses = {
    'top-left': cn(
      'cursor-nw-resize',
      'border-t-2 border-l-2 rounded-tl-full',
      'hover:-top-2 hover:-left-2 hover:border-t-4 hover:border-l-4',
      {
        'animate-slide-in-top-left': isShowing,
        'animate-slide-out-top-left': (!isShowing && !isFirstLoad),
      },
    ),
    'top-right': cn(
      'cursor-sw-resize',
      'border-t-2 border-r-2 rounded-tr-full',
      'hover:-top-2 hover:-right-2 hover:border-t-4 hover:border-r-4',
      {
        'animate-slide-in-top-right': isShowing,
        'animate-slide-out-top-right': (!isShowing && !isFirstLoad),
      }
    ),
    'bottom-left': cn(
      'cursor-sw-resize',
      'border-b-2 border-l-2 rounded-bl-full',
      'hover:-bottom-2 hover:-left-2 hover:border-b-4 hover:border-l-4',
      {
        'animate-slide-in-bottom-left': isShowing,
        'animate-slide-out-bottom-left': (!isShowing && !isFirstLoad),
      }
    ),
    'bottom-right': cn(
      'cursor-nw-resize',
      'border-b-2 border-r-2 rounded-br-full',
      'hover:-bottom:-2 hover:-right-2 hover:border-b-4 hover:border-r-4',
      {
        'animate-slide-in-bottom-right': isShowing,
        'animate-slide-out-bottom-right': (!isShowing && !isFirstLoad),
      }
    ),
  }

  useEffect(() => {
    if (isFirstLoad && isShowing) {
      setIsFirstLoad(false);
    }
  }, [isShowing]);

  useEffect(() => {
    setIsFirstLoad(true);
  }, []);

  return (
    <div
      className={cn(
        'absolute w-4 h-4 border-brand-primary hover:border-brand-primary',
        'transition-all',
        postionClasses[position],
        {
          'opacity-0': isFirstLoad,
        },
        className,
      )}
      onMouseDown={resizeStart}
    >

    </div>
  );
}
