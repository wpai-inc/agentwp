import React from 'react';
import { cn } from '@/lib/utils';
import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import SettingsIcon from '@material-design-icons/svg/outlined/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import { Badge } from '@/Components/ui/badge';
import Logo from '@/Components/Logo';
import { useChat } from '@/Providers/ChatProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import History from '../Settings/History';
import { useClient } from '@/Providers/ClientProvider';
import ClearConversationButton from '@/Components/Chat/Toolbar/ClearConversationButton';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';
import ChatSettings from '../Settings/ChatSettings';
import { usePage } from '@/Providers/PageProvider';

export default function ChatTopBar() {
  const { setChatSetting } = useChat();
  const { userProfileUrl } = useClient();
  const { page } = usePage();

  function onUpgradeClick( e: React.FormEvent ) {
    setChatSetting( {
      component: <p>Upgrading</p>,
      header: 'Upgrading',
    } );
  }

  function handleHistorySettings( e: React.FormEvent ) {
    if ( page.onboarding_completed && page.agentwp_access ) {
      setChatSetting( {
        component: <History />,
        header: 'History',
      } );
    }
  }

  function onSettingsClick() {
    if ( page.onboarding_completed && page.agentwp_access ) {
      if ( page.onboarding_completed && page.agentwp_access ) {
        document.location.href = page.settings_page;
      }
    }
  }

  return (
    <div className={ cn( 'py-2 px-2 border-b border-b-brand-gray-25', 'flex justify-between' ) }>
      <div className="flex h-8 items-center gap-2">
        <Logo className="h-full" />
        { /*<Badge variant="primary">Free</Badge>*/ }
        { /*<Badge onClick={ onUpgradeClick } className="cursor-pointer">*/ }
        { /*  Upgrade*/ }
        { /*</Badge>*/ }
      </div>
      <div className="flex items-center gap-1 text-gray-900 hover:text-black">
        <AgentTooltip content="New conversation">
          <ClearConversationButton>
            <AddIcon className="h-5 w-5" />
          </ClearConversationButton>
        </AgentTooltip>
        <AgentTooltip content="View history">
          <button onClick={ handleHistorySettings }>
            <HistoryIcon className="h-5 w-5" />
          </button>
        </AgentTooltip>
        <AgentTooltip content="Settings">
          <button onClick={ onSettingsClick }>
            <SettingsIcon className="h-5 w-5" />
          </button>
        </AgentTooltip>
        { ( ! page.onboarding_completed ||
          ( page.onboarding_completed && page.agentwp_manager ) ) && (
          <AgentTooltip content="Your profile">
            <a href={ userProfileUrl } className="block" target="_blank">
              <AccountIcon className="h-5 w-5" />
            </a>
          </AgentTooltip>
        ) }
      </div>
    </div>
  );
}
