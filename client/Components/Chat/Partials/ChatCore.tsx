import { useState, useMemo } from 'react';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import UpdateNotification from '@/Components/Chat/Partials/UpdateNotification';
import ChatNav from '@/Components/Chat/Partials/ChatNav';
import { ConversationTab, SupportTab, SettingsTab } from '@/Components/Chat/Tabs';
import ConvoOnlyNotice from './ConvoOnlyNotice';
import { useAccountSettings } from '@/Providers/AccountSettingsProvider';

export type TabKey = 'convo' | 'search' | 'support' | 'settings';
export type HandleDrag = { handleDrag?: ( e: MouseEvent ) => void };

type PageComponents = {
  [ key in TabKey ]?: JSX.Element;
};

export default function ChatCore( { handleDrag }: HandleDrag ) {
  const [ tab, setTab ] = useState< TabKey >( 'convo' );
  const { getAccountSetting } = useAccountSettings();
  const convoOnly = getAccountSetting( 'convoOnly' )?.value || false;

  const pages = useMemo< PageComponents >(
    () => ( {
      convo: <ConversationTab />,
      // search: <SearchTab />,
      support: <SupportTab />,
      settings: <SettingsTab />,
    } ),
    [],
  );

  return (
    <div className="flex h-full flex-col">
      <ChatTopBar handleDrag={ handleDrag } />
      { /* <BetaNotice /> */ }
      <UpdateNotification />
      { convoOnly && <ConvoOnlyNotice /> }
      { pages[ tab ] }
      <ChatNav tab={ tab } setTab={ setTab } />
      <ChatOverlay />
    </div>
  );
}
