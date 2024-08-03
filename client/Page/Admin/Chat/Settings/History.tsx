import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import type { HistoryItem, HistoryType } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';

export default function History() {
  const [ history, setHistory ] = useState< HistoryType >();
  const { getHistory, unclearConversation } = useClient();
  const { since, setSince, refreshConvo } = useUserRequests();

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

  return (
    <div className="space-y-4">
      { ! history ? (
        <LoadingScreen />
      ) : (
        <div className="space-y-3">
          { history.lastRequest && (
            <HistoryItem>
              <button
                className="flex w-full gap-4"
                onClick={ () => setSince( history.lastRequest.createdAt ) }>
                <time className="block text-nowrap font-bold">
                  Resume { history.lastRequest.humanCreatedAt }
                </time>
                <span className="truncate">"{ history.lastRequest.message }"</span>
              </button>
            </HistoryItem>
          ) }
          { history?.items?.data.length > 0 && <HistoryList items={ history.items.data } /> }
        </div>
      ) }
    </div>
  );

  function HistoryList( { items }: { items: HistoryItem[] } ) {
    return items.map( item => (
      <HistoryItem key={ item.createdAt }>
        <div className="flex justify-between gap-4">
          <strong>Cleared { item.humanCreatedAt }</strong>
          <button className="underline" onClick={ () => handleUnclear( item.createdAt ) }>
            Unclear
          </button>
        </div>
      </HistoryItem>
    ) );
  }
}

function HistoryItem( { children }: { children: React.ReactNode } ) {
  return <div className="rounded bg-slate-100 px-4 py-2">{ children }</div>;
}
