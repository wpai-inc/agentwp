import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import { HistoryData } from '@/Types/types';
import IconRemove from '@material-design-icons/svg/outlined/remove.svg?react';
import { optimistic } from '@/lib/utils';

export default function History() {
  const [ history, setHistory ] = useState< HistoryData[] >( [] );
  const { getHistory, deleteConversation } = useClient();
  const { since, setSince } = useUserRequests();
  const { clearHistory, setChatSetting, isEmptyConversation } = useChat();

  useEffect( () => {
    fetchHistory( since );
  }, [ since ] );

  async function fetchHistory( since: string | null ) {
    const history = await getHistory( since );
    setHistory( history );
  }

  function handleClearConvo() {
    setChatSetting( null );
    clearHistory();
  }

  function handleResume( createdAt: string ) {
    setSince( createdAt );
    setChatSetting( null );
  }

  function handleDeleteConvo( convo: HistoryData ) {
    const originalHistory = history;
    optimistic(
      async () => await deleteConversation( convo.conversationId ),
      () =>
        setHistory( history => history?.filter( c => c.conversationId !== convo.conversationId ) ),
      () => setHistory( originalHistory ),
    );
  }

  return (
    <div className="space-y-4">
      { ! history ? (
        <LoadingScreen />
      ) : (
        <div className="space-y-8 max-w-screen-sm mx-auto w-full">
          { history.length > 0 && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-bold">Conversations</h2>
                { ! isEmptyConversation && (
                  <button className="underline" onClick={ handleClearConvo }>
                    Clear Current Conversation
                  </button>
                ) }
              </div>
              <HistoryList items={ history } />
            </div>
          ) }
        </div>
      ) }
    </div>
  );

  function HistoryList( { items }: { items: HistoryData[] } ) {
    return items.map( convo => <HistoryItem key={ convo.conversationId } convo={ convo } /> );
  }

  function HistoryItem( { convo }: { convo: HistoryData } ) {
    return (
      <div className="flex w-full items-center gap-4 bg-slate-100 mb-2 rounded">
        <button
          className="hover:bg-slate-200 transition-colors px-4 py-2"
          onClick={ () => handleResume( convo.conversationCreatedAt ) }>
          <time className="block text-nowrap font-semibold">Resume { convo.humanCreatedAt }</time>
        </button>
        <blockquote className="truncate flex-1">{ convo.message }</blockquote>
        <button
          onClick={ () => handleDeleteConvo( convo ) }
          className="hover:bg-slate-200  transition-colors p-2">
          <IconRemove className="w-5 h-5" />
        </button>
      </div>
    );
  }
}
