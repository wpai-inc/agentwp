import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import type { HistoryItem, HistoryType } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';

export default function History() {
  const [ history, setHistory ] = useState< HistoryType >();
  const { getHistory, unclearConversation } = useClient();
  const { since, setSince, refreshConvo } = useUserRequests();
  const { clearHistory, setChatSetting, isEmptyConversation } = useChat();

  useEffect( () => {
    fetchHistory( since );
  }, [ since ] );

  async function fetchHistory( since: string | null ) {
    const history = await getHistory( since );
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
          { history.lastRequest && (
            <div>
              <h2 className="font-bold mb-3">Previous Conversations</h2>
              <HistoryItem>
                <button
                  className="flex w-full gap-4"
                  onClick={ () => handleResume( history.lastRequest.createdAt ) }>
                  <time className="block text-nowrap font-bold">
                    Resume { history.lastRequest.humanCreatedAt }
                  </time>
                  <span className="truncate">"{ history.lastRequest.message }"</span>
                </button>
              </HistoryItem>
            </div>
          ) }
          { history?.items?.data.length > 0 && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-bold">Cleared Conversations</h2>
                { ! isEmptyConversation && (
                  <button className="underline" onClick={ handleClearConvo }>
                    Clear Current Conversation
                  </button>
                ) }
              </div>
              <HistoryList items={ history.items.data } />
            </div>
          ) }
        </div>
      ) }
    </div>
  );

  function HistoryList( { items }: { items: HistoryItem[] } ) {
    return items.map( item => (
      <HistoryItem key={ item.createdAt } className="flex justify-between gap-4 mb-2">
        <strong>Cleared { item.humanCreatedAt }</strong>
        <button className="underline" onClick={ () => handleUnclear( item.createdAt ) }>
          Unclear
        </button>
      </HistoryItem>
    ) );
  }
}

function HistoryItem( { children, className }: { children: React.ReactNode; className?: string } ) {
  return <div className={ cn( 'rounded bg-slate-100 px-4 py-2', className ) }>{ children }</div>;
}
