import { cn } from '@/lib/utils';
import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import SettingsIcon from '@material-design-icons/svg/outlined/settings.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import Logo from '@/Components/Logo';
import { useChat } from '@/Providers/ChatProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import History from '../Settings/History';
import { useClient } from '@/Providers/ClientProvider';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';
import { usePage } from '@/Providers/PageProvider';
import { useChatUI } from '@/Components/Chat/Chat';

export default function ChatTopBar( { handleDrag }: { handleDrag?: ( e: MouseEvent ) => void } ) {
  const { setChatSetting, clearHistory, isEmptyConversation } = useChat();
  const { toggle } = useChatUI();
  const { userProfileUrl } = useClient();
  const { page } = usePage();

  function handleHistorySettings() {
    setChatSetting( {
      component: <History />,
      header: 'History',
    } );
  }

  return (
    <div
      onMouseDown={ e => {
        if ( handleDrag ) {
          handleDrag( e.nativeEvent );
        }
      } }
      className={ cn(
        'py-2 px-2 cursor-move border-b border-b-brand-gray-25',
        'flex justify-between',
      ) }>
      <div className="flex h-8 items-center gap-2">
        <Logo className="h-full" />
      </div>
      <div className="flex items-center gap-1 text-gray-900 hover:text-black">
        { page.onboarding_completed && page.agentwp_access && ! isEmptyConversation && (
          <AgentTooltip content="New conversation">
            <button onClick={ clearHistory }>
              <AddIcon className="h-5 w-5" />
            </button>
          </AgentTooltip>
        ) }
        <AgentTooltip content="View history">
          <button onClick={ handleHistorySettings }>
            <HistoryIcon className="h-5 w-5" />
          </button>
        </AgentTooltip>
        <AgentTooltip content="Settings">
          <a href={ page.settings_page } onClick={ toggle }>
            <SettingsIcon className="h-5 w-5" />
          </a>
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
