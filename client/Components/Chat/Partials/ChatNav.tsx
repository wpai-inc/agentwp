import { forwardRef } from 'react';
import IconChat from '@material-design-icons/svg/outlined/mode_comment.svg?react';
import IconSearch from '@material-design-icons/svg/outlined/search.svg?react';
import IconAgent from '@material-design-icons/svg/outlined/support_agent.svg?react';
import IconSettings from '@material-design-icons/svg/outlined/settings.svg?react';
import { TabKey } from './ChatCore';
import { cn } from '@/lib/utils';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { usePage } from '@/Providers/PageProvider';
import { maybeUseChatUI } from '@/Components/Chat/Chat';

export default function ChatNav( {
  tab,
  setTab,
}: {
  tab: TabKey;
  setTab: ( tab: TabKey ) => void;
} ) {
  const toggle = maybeUseChatUI()?.toggle;
  const { page } = usePage();

  return (
    <nav className="grid grid-cols-4 gap-2 p-2">
      <Tab icon={ IconChat } active={ tab === 'convo' } onClick={ () => setTab( 'convo' ) } />
      <Tab icon={ IconSearch } active={ tab === 'search' } onClick={ () => setTab( 'search' ) } />
      <Tab icon={ IconAgent } active={ tab === 'support' } onClick={ () => setTab( 'support' ) } />
      <AgentTooltip content="Settings">
        <Tab
          el="a"
          icon={ IconSettings }
          active={ tab === 'settings' }
          href={ page.settings_page }
          onClick={ () => toggle && toggle() }
        />
      </AgentTooltip>
    </nav>
  );
}

const Tab = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  {
    icon: React.ElementType;
    active?: boolean;
    el?: React.ElementType;
    [ key: string ]: any;
  }
>( ( { icon: Icon, active = false, el: Element = 'button', ...props }, ref ) => {
  return (
    <Element
      ref={ ref }
      role="tab"
      aria-selected="true"
      className={ cn(
        'hover:bg-brand-gray transition text-brand-gray-50 rounded-lg p-2 inline-flex items-center justify-center',
        {
          'bg-brand-gray': active,
        },
      ) }
      { ...props }>
      <Icon className="h-6 w-6" />
    </Element>
  );
} );

Tab.displayName = 'Tab';
