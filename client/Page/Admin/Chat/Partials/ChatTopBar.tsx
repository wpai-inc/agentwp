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
    let currentPosX = e.clientX - e.target.getBoundingClientRect().left;
    let currentPosY = e.clientY - e.target.getBoundingClientRect().top;

    const drag = (target, x, y) => {
      target.style.left = x - currentPosX + 'px';
      target.style.top = y - currentPosY + 'px';
    }

    const handleDrag = (e) => {
      drag(e.target.parentNode, e.pageX, e.pageY);
    }

    drag(e.target.parentNode, e.pageX, e.pageY);

    e.target.addEventListener('mousemove', handleDrag);
    e.target.addEventListener('mouseup', () => {
      setSettings({
        x: e.target.parentNode.style.left,
        y: e.target.parentNode.style.top,
      });
      e.target.removeEventListener('mousemove', handleDrag);
      e.target.onmouseup = null;
    });
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
