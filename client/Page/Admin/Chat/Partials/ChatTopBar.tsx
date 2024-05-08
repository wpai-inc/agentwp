import { cn } from '@/lib/utils';
import SettingsIcons from '@material-design-icons/svg/filled/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Button } from '@/Components/ui/button';

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
      <div></div>
      <div className="flex items-center">
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className={cn(
            'font-semibold h-7 px-8 rounded-full',
          )}
        >
          Upgrade
        </Button>
        <Button onClick={onSettingsClick} variant="ghost" size="icon">
          <SettingsIcons className="h-7 w-7" />
        </Button>
        <Button onClick={onProfileClick} variant="ghost" size="icon">
          <AccountIcon className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}
