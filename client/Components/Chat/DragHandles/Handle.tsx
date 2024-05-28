import React from 'react';
import { cn, getChatwindowElement } from '@/lib/utils';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

type Props = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export default function Handle({
  position,
  className
}: Props) {
  const { setSettings } = useClientSettings();

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
    let lastWidth = chatWindowRect.width;
    let lastHeight = chatWindowRect.height;

    const resize = (target, x, y) => {
      const displacedDistanceX = startPosX - x;
      const displacedDistanceY = startPosY - y;

      let newWidth;
      let newHeight;
      let newTranslateX = initialWindowX;
      let newTranslateY = initialWindowY;
      if (position === 'top-left') {
        newWidth = initialWidth + displacedDistanceX;
        newHeight = initialHeight + displacedDistanceY;
      } else if (position === 'top-right') {
        newWidth = initialWidth - displacedDistanceX;
        newHeight = initialHeight + displacedDistanceY;
        newTranslateX = initialWindowX - (startPosX - x);
      } else if (position === 'bottom-left') {
        newWidth = initialWidth + displacedDistanceX;
        newHeight = initialHeight - displacedDistanceY;
        newTranslateY = initialWindowY - (startPosY - y);
      } else if (position === 'bottom-right') {
        newWidth = initialWidth - displacedDistanceX;
        newHeight = initialHeight - displacedDistanceY;
        newTranslateX = initialWindowX - (startPosX - x);
        newTranslateY = initialWindowY - (startPosY - y);
      }
      // restrict based on upper and lower bounds
      if (newWidth > 500 && newWidth < maxWidth) {
        target.style.width = newWidth + 'px';
        lastWidth = newWidth;
      }
      if (newHeight > 650 && newHeight < maxHeight) {
        target.style.height = newHeight + 'px';
        lastHeight = newHeight;
      }
      target.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
    }

    const handleResize = (e) => {
      resize(chatWindow, e.clientX, e.clientY);
    }

    const disableResize = () => {
      setSettings({
        width: lastWidth,
        height: lastHeight,
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
      'border-t-2 border-l-2 rounded-tl-full -top-1 -left-1',
      'hover:-top-2 hover:-left-2 hover:border-t-4 hover:border-l-4',
    ),
    'top-right': cn(
      'cursor-sw-resize',
      'border-t-2 border-r-2 rounded-tr-full -top-1 -right-1',
      'hover:-top-2 hover:-right-2 hover:border-t-4 hover:border-r-4'
    ),
    'bottom-left': cn(
      'cursor-sw-resize',
      'border-b-2 border-l-2 rounded-bl-full -bottom-1 -left-1',
      'hover:-bottom-2 hover:-left-2 hover:border-b-4 hover:border-l-4'
    ),
    'bottom-right': cn(
      'cursor-nw-resize',
      'border-b-2 border-r-2 rounded-br-full -bottom-1 -right-1',
      'hover:-bottom:-2 hover:-right-2 hover:border-b-4 hover:border-r-4'
    ),
  }
  return (
    <div
      className={cn(
        'absolute w-4 h-4 border-slate-400 hover:border-brand-primary',
        'transition-all',
        postionClasses[position],
        className,
      )}
      onMouseDown={resizeStart}
    >

    </div>
  );
}
