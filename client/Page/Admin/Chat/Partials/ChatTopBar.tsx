import React from 'react';
import { cn } from '@/lib/utils';
import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import SettingsIcon from '@material-design-icons/svg/outlined/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import Logo from '@/Components/Logo';
import { useChat } from '@/Providers/ChatProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import History from '../Settings/History';
import { useClient } from '@/Providers/ClientProvider';
import ClearConversationButton from '@/Components/Chat/Toolbar/ClearConversationButton';

export default function ChatTopBar() {
  const { setChatSetting } = useChat();
  const { userProfileUrl } = useClient();

  function onUpgradeClick( e: React.FormEvent ) {
    setChatSetting( {
      component: <p>Upgrading</p>,
      header: 'Upgrading',
    } );
  }

  function handleHistorySettings( e: React.FormEvent ) {
    setChatSetting( {
      component: <History />,
      header: 'History',
    } );
  }

  function onSettingsClick( e: React.FormEvent ) {
    setChatSetting( {
      component: <p>Settings</p>,
      header: 'Settings',
    } );
  }

  return (
    <div className={ cn( 'py-2 px-2 border-b border-b-brand-gray-25', 'flex justify-between' ) }>
      <div className="flex items-center gap-2">
        <Logo className="w-7 h-7" />
        <Badge className="h-7">Free</Badge>
        <Button
          onClick={ onUpgradeClick }
          size="sm"
          className={ cn( 'font-semibold h-7 px-6 rounded-full bg-zinc-600' ) }>
          Upgrade
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <AgentTooltip content="New conversation">
          <ClearConversationButton />
        </AgentTooltip>
        <AgentTooltip content="View history">
          <Button
            asChild
            onClick={ handleHistorySettings }
            variant="ghost"
            size="icon"
            className="cursor-pointer">
            <HistoryIcon className="h-5 w-5 text-gray-900 hover:text-black" />
          </Button>
        </AgentTooltip>
        <AgentTooltip content="Settings">
          <Button
            asChild
            onClick={ onSettingsClick }
            variant="ghost"
            size="icon"
            className="cursor-pointer">
            <SettingsIcon className="h-5 w-5 text-gray-900 hover:text-black" />
          </Button>
        </AgentTooltip>
        <AgentTooltip content="Your profile">
          <Button asChild variant="ghost" size="icon" className="cursor-pointer">
            <a href={ userProfileUrl }>
              <AccountIcon className="h-5 w-5 text-gray-900 hover:text-black" />
            </a>
          </Button>
        </AgentTooltip>
      </div>
    </div>
  );
}
