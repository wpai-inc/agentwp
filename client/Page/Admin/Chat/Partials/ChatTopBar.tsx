import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import SettingsIcons from '@material-design-icons/svg/filled/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

export default function ChatTopBar() {
  const { setSettings } = useClientSettings();
  const topBarRef = useRef(null);

  function onUpgradeClick(e: React.FormEvent) {
    e.preventDefault();
  }

  function onSettingsClick(e: React.FormEvent) {
    e.preventDefault();
  }

  function onProfileClick(e: React.FormEvent) {
    e.preventDefault();
  }

  function startDrag(e) {
    const containerElement = document.getElementById('wpbody');
    const containerCoords = containerElement.getBoundingClientRect();
    let startPosX = e.clientX - e.target.getBoundingClientRect().left;
    let startPosY = e.clientY - e.target.getBoundingClientRect().top;

    const disableDrag = (e) => {
      setSettings({
        x: e.target.parentNode.style.left,
        y: e.target.parentNode.style.top,
      });
      e.target.removeEventListener('mousemove', handleDrag);
      e.target.onmouseup = null;
      e.target.mouseleave = null;
    }

    const drag = (target, x, y) => {
      const chatWindowCoords = target.getBoundingClientRect();

      // get thew new bounding rect it will be moved to
      const newPositionLeft = x - startPosX;
      const newPositionRight = x - startPosX + chatWindowCoords.width;
      const newPositionTop = y - startPosY;
      const newPositionBottom = y - startPosY + chatWindowCoords.height;

      // check if any of the new bounding rects are out of bounds
      const leftOutOfBounds = newPositionLeft < containerCoords.left;
      const rightOutOfBounds = newPositionRight > containerCoords.right;
      const topOutOfBounds = newPositionTop < containerCoords.top;
      const bottomOutOfBounds = newPositionBottom > containerCoords.bottom;

      // deny drag accordingly
      if (!leftOutOfBounds && !rightOutOfBounds) {
        target.style.left = newPositionLeft + 'px';
      }
      if (!topOutOfBounds && !bottomOutOfBounds) {
        target.style.top = newPositionTop + 'px';
      }
    }

    const handleDrag = (e) => {
      drag(e.target.parentNode, e.pageX, e.pageY);
    }

    drag(e.target.parentNode, e.pageX, e.pageY);

    e.target.addEventListener('mousemove', handleDrag);
    e.target.addEventListener('mouseup', disableDrag);
    e.target.addEventListener('mouseleave', disableDrag);
  }

  useEffect(() => {
    const element = topBarRef.current;
    element.addEventListener('mousedown', startDrag);

    return () => {
      element.removeEventListener('mousedown', startDrag);
    }
  }, []);

  return (
    <div
      ref={topBarRef}
      className={cn(
        'py-2 px-2 border-b border-b-brand-gray-25',
        'flex justify-between cursor-move'
      )}
    >
      <div className="flex items-center gap-2">
        <Badge className={cn(
          'bg-brand-primary hover:bg-brand-primary font-bold'
        )}>
          Free
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className={cn(
            'font-semibold h-7 px-8 rounded-full',
          )}
        >
          Upgrade
        </Button>
        <Button
          asChild
          onClick={onSettingsClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <SettingsIcons className="h-7 w-7" />
        </Button>
        <Button
          asChild
          onClick={onProfileClick}
          variant="ghost"
          size="icon"
          className="cursor-pointer"
        >
          <AccountIcon className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
