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

export default function ChatTopBar( {
  dragHandler,
}: {
  dragHandler: ( e: React.MouseEvent< HTMLDivElement > ) => void;
} ) {
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

  function onSettingsClick() {
    setChatSetting( {
      component: <ChatSettings />,
      header: 'Settings',
    } );
  }

  return (
    <div
      onMouseDown={ dragHandler }
      className={ cn(
        'py-2 px-2 cursor-move border-b border-b-brand-gray-25',
        'flex justify-between',
      ) }>
      <div className="flex h-8 items-center gap-2">
        <Logo className="h-full" />
        <Badge variant="primary">Free</Badge>
        <Badge onClick={ onUpgradeClick } className="cursor-pointer">
          Upgrade
        </Badge>
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
        <AgentTooltip content="Your profile">
          <a href={ userProfileUrl } className="block" target="_blank">
            <AccountIcon className="h-5 w-5" />
          </a>
        </AgentTooltip>
      </div>
    </div>
  );
}
