import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import { HistoryData } from '@/Types/types';

export default function History() {
  const [ history, setHistory ] = useState< HistoryData[] >();
  const { getHistory, unclearConversation } = useClient();
  const { since, setSince, refreshConvo } = useUserRequests();
  const { clearHistory, setChatSetting, isEmptyConversation } = useChat();

  useEffect( () => {
    fetchHistory( since );
  }, [ since ] );

  async function fetchHistory( since: string | null ) {
    const history = await getHistory( since );
    console.log( history );
    setHistory( history );
  }

  async function handleUnclear( since: string | null ) {
    await unclearConversation( since );
    fetchHistory( null );
    refreshConvo();
  }

  function handleClearConvo() {
    clearHistory();
    setChatSetting( null );
  }

  function handleResume( createdAt: string ) {
    setSince( createdAt );
    setChatSetting( null );
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
      <button
        className="flex w-full justify-between gap-4 mb-2 rounded bg-slate-100 px-4 py-2 hover:bg-slate-200 transition-colors"
        onClick={ () => handleResume( convo.conversationCreatedAt ) }>
        <time className="block text-nowrap font-semibold">Resume { convo.humanCreatedAt }</time>
        <blockquote className="truncate">{ convo.message }</blockquote>
      </button>
    );
    {
      /* <button
          className="underline"
          onClick={ () => handleUnclear( convo.conversationCreatedAt ) }>
          Unclear
        </button> */
    }
  }
}
