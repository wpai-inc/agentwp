import { useState, useMemo } from 'react';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import UpdateNotification from '@/Components/Chat/Partials/UpdateNotification';
import ChatNav from '@/Components/Chat/Partials/ChatNav';
import { ConversationTab, SearchTab, SupportTab, SettingsTab } from '@/Components/Chat/Tabs';
import BetaNotice from './BetaNotice';
import ConvoOnlyNotice from './ConvoOnlyNotice';
import { usePage } from '@/Providers/PageProvider';

export type TabKey = 'convo' | 'search' | 'support' | 'settings';
export type HandleDrag = { handleDrag?: ( e: MouseEvent ) => void };

type PageComponents = Record< TabKey, JSX.Element >;

export default function ChatCore( { handleDrag }: HandleDrag ) {
  const [ tab, setTab ] = useState< TabKey >( 'convo' );
  const { getAccountSetting } = usePage();
  const convoOnly = getAccountSetting( 'convoOnly' )?.value || false;

  const pages = useMemo< PageComponents >(
    () => ( {
      convo: <ConversationTab />,
      search: <SearchTab />,
      support: <SupportTab />,
      settings: <SettingsTab />,
    } ),
    [],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-2">
        <div>
          <ChatTopBar handleDrag={ handleDrag } />
          <UpdateNotification />
        </div>
        <BetaNotice />
      </div>
      { convoOnly && <ConvoOnlyNotice /> }
      { pages[ tab ] }
      <ChatNav tab={ tab } setTab={ setTab } />
      <ChatOverlay />
    </div>
  );
}
