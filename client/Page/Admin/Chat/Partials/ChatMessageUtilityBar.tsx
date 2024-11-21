import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import { useChat } from '@/Providers/ChatProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import History from '../Settings/History';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';
import { usePage } from '@/Providers/PageProvider';
import { Button } from '@/Components/ui/button';
import { useTranslation } from 'react-i18next';

export default function ChatMessageUtilityBar() {
  const { t } = useTranslation();
  const { setChatSetting, clearHistory, isEmptyConversation } = useChat();
  const { page } = usePage();

  function handleHistorySettings() {
    setChatSetting( {
      component: <History />,
      header: 'History',
    } );
  }

  return (
    <div className="flex items-center justify-end">
      { page.onboarding_completed && page.agentwp_access && ! isEmptyConversation && (
        <Button onClick={ clearHistory } className="w-full uppercase">
          { t( 'New Chat' ) }
          <AddIcon className="h-4 w-4" />
        </Button>
      ) }
      <AgentTooltip content={ t( 'View history' ) }>
        <Button onClick={ handleHistorySettings } variant="ghost" size="sm">
          <HistoryIcon className="h-5 w-5" />
        </Button>
      </AgentTooltip>
    </div>
  );
}
