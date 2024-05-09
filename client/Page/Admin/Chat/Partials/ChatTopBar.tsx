import React from 'react';
import { cn } from '@/lib/utils';
import SettingsIcons from '@material-design-icons/svg/filled/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

export default function ChatTopBar() {
  function onUpgradeClick(e: React.FormEvent) {
    e.preventDefault();
  }

  function onSettingsClick(e: React.FormEvent) {
    e.preventDefault();
  }

  function onProfileClick(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div
      className={cn(
        'py-2 px-2 border-b border-b-brand-gray-25',
        'flex justify-between'
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
