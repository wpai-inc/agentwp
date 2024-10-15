import { cn } from '@/lib/utils';
import HistoryIcon from '@material-design-icons/svg/outlined/history.svg?react';
import AccountIcon from '@material-design-icons/svg/outlined/account_circle.svg?react';
import Logo from '@/Components/Logo';
import { useChat } from '@/Providers/ChatProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import History from '../Settings/History';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';
import { usePage } from '@/Providers/PageProvider';
import { maybeUseChatUI } from '@/Components/Chat/Chat';
import { Button } from '@/Components/ui/button';
import ConvoOnlyToggle from './ConvoOnlyToggle';
import { useAccount } from '@/Providers/AccountProvider';

import type { HandleDrag } from '@/Components/Chat/Partials/ChatCore';
import type { AccountType } from '@/Providers/AccountProvider';

export default function ChatTopBar( { handleDrag }: HandleDrag ) {
  const { setChatSetting, clearHistory, isEmptyConversation } = useChat();
  const toggle = maybeUseChatUI()?.toggle;
  const { page, userProfileUrl } = usePage();
  const { account } = useAccount();

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
      className={ cn( 'flex justify-between p-3 cursor-pointer', {
        'cursor-move': handleDrag,
      } ) }>
      <div className="flex items-center gap-2">
        <a
          href={ page.settings_page }
          onClick={ () => toggle && toggle() }
          className="hover:scale-125 transition">
          <Logo className="h-7 w-7" />
        </a>
        { account?.plan.slug === 'free' && <FreeUpgrade account={ account } /> }
        <ConvoOnlyToggle />
      </div>
      <div className="flex items-center justify-center">
        { page.onboarding_completed && page.agentwp_access && ! isEmptyConversation && (
          <AgentTooltip content="New conversation">
            <Button onClick={ clearHistory } className="uppercase">
              <span className="hidden @lg:inline">New Chat</span>
              <AddIcon className="h-4 w-4" />
            </Button>
          </AgentTooltip>
        ) }
        <AgentTooltip content="View history">
          <Button onClick={ handleHistorySettings } variant="ghost" size="sm">
            <HistoryIcon className="h-5 w-5" />
          </Button>
        </AgentTooltip>
        <AgentTooltip content="Your profile">
          <Button asChild variant="ghost" size="sm">
            <a href={ userProfileUrl } target="_blank">
              <AccountIcon className="h-5 w-5" />
            </a>
          </Button>
        </AgentTooltip>
      </div>
    </div>
  );

  function FreeUpgrade( { account }: { account: AccountType } ) {
    return (
      <>
        <Button asChild variant="brand" className="h-full hidden @md:inline-flex">
          <span>{ account.plan.name }</span>
        </Button>
        <Button asChild variant="dark" className="h-full">
          <a id="topBarUpgradeBtn" href={ account.upgrade_link }>
            Upgrade
          </a>
        </Button>
      </>
    );
  }
}
