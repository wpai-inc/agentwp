import React from 'react';
import { cn } from '@/lib/utils';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';
import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import SettingsIcon from '@material-design-icons/svg/outlined/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import Logo from '@/Components/Logo';
import { useChat } from '@/Providers/ChatProvider';

export default function ChatTopBar() {
  const { openChatOverlay } = useChat();

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

  return (
    <div
      className={cn(
        'py-2 px-2 border-b border-b-brand-gray-25',
        'flex justify-between',
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
