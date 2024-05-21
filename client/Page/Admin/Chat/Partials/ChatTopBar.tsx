import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';
import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import SettingsIcon from '@material-design-icons/svg/outlined/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import Logo from '@/Components/Logo';
import { useChat } from '@/Providers/ChatProvider';

export default function ChatTopBar() {
  const { setSettings } = useClientSettings();
  const { openChatOverlay } = useChat();
  const topBarRef = useRef(null);

  function onUpgradeClick(e: React.FormEvent) {
    e.preventDefault();
    openChatOverlay('Upgrading');
  }

  function onAddClick(e: React.FormEvent) {
    e.preventDefault();
    openChatOverlay('Adding');
  }

  function onHistoryClick(e: React.FormEvent) {
    e.preventDefault();
    openChatOverlay('History');
  }

  function onSettingsClick(e: React.FormEvent) {
    e.preventDefault();
    openChatOverlay('Settings');
  }

  function onProfileClick(e: React.FormEvent) {
    e.preventDefault();
    openChatOverlay('Profile');
  }

  function startDrag(e) {
    e.preventDefault();
    const chatWindow = document.getElementById('awp-chat');
    if (chatWindow.classList.contains('maximized')) {
      return;
    }
    const bodyElement = document.getElementsByTagName('body')[0];
    const containerElement = document.getElementById('wpbody');
    const containerCoords = containerElement.getBoundingClientRect();
    const initialMousePositionX = e.clientX;
    const initialMousePositionY = e.clientY;
    const computedStyle = window.getComputedStyle(chatWindow);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);

    const initialPositionX = matrix.m41;
    const initialPositionY = matrix.m42;
    let lastPositionX = matrix.m41;
    let lastPositionY = matrix.m42;

    let startPosX = e.clientX - e.target.getBoundingClientRect().left;
    let startPosY = e.clientY - e.target.getBoundingClientRect().top;

    const disableDrag = (e) => {
      setSettings({
        x: lastPositionX,
        y: lastPositionY,
      });
      bodyElement.removeEventListener('mousemove', handleDrag);
      bodyElement.onmouseup = null;
    };

    const drag = (target, x, y) => {
      const currentPositionMatrix = new DOMMatrixReadOnly(computedStyle.transform);

      // check if any of the new bounding rects are out of bounds
      const newPositionLeft = x - startPosX;
      const newPositionTop = y - startPosY;
      const leftOutOfBounds = newPositionLeft < containerCoords.left;
      const topOutOfBounds = newPositionTop < containerCoords.top;

      let newCoordsX = currentPositionMatrix.m41;
      let newCoordsY = currentPositionMatrix.m42;

      if (!leftOutOfBounds) {
        newCoordsX = x - initialMousePositionX + initialPositionX;
      }

      if (!topOutOfBounds) {
        newCoordsY = y - initialMousePositionY + initialPositionY;
      }

      target.style.transform = `translate(${newCoordsX}px, ${newCoordsY}px)`;
      lastPositionX = newCoordsX;
      lastPositionY = newCoordsY;
    };

    const handleDrag = (e) => {
      drag(chatWindow, e.clientX, e.clientY);
    };

    bodyElement.addEventListener('mousemove', handleDrag);
    bodyElement.addEventListener('mouseup', disableDrag);
  }

  useEffect(() => {
    const element = topBarRef.current;
    element.addEventListener('mousedown', startDrag);

    return () => {
      element.removeEventListener('mousedown', startDrag);
    };
  }, []);

  return (
    <div
      ref={topBarRef}
      className={cn(
        'py-2 px-2 border-b border-b-brand-gray-25',
        'flex justify-between cursor-move',
      )}
    >
      <div className="flex items-center gap-2">
        <Logo className="w-6 h-6" />
        <Badge>Free</Badge>
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className={cn('font-semibold h-7 px-6 rounded-full bg-zinc-600')}
        >
          Upgrade
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          asChild
          onClick={onAddClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <AddIcon className="h-6 w-6 text-gray-500 hover:text-black" />
        </Button>
        <Button
          asChild
          onClick={onHistoryClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <HistoryIcon className="h-6 w-6 text-gray-500 hover:text-black" />
        </Button>
        <Button
          asChild
          onClick={onSettingsClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <SettingsIcon className="h-6 w-6 text-gray-500 hover:text-black" />
        </Button>
        <Button
          asChild
          onClick={onProfileClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <AccountIcon className="h-6 w-6 text-gray-500 hover:text-black" />
        </Button>
      </div>
    </div>
  );
}
