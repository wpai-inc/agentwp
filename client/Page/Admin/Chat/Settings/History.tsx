import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import type { HistoryItem, HistoryType } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';

export default function History() {
  const [ history, setHistory ] = useState< HistoryType >();
  const { getHistory } = useClient();
  const { since, setSince } = useUserRequests();

  useEffect( () => {
    fetchHistory( since );
  }, [ since ] );

  async function fetchHistory( since: string | null ) {
    const history = await getHistory( since );
    setHistory( history );
  }

  return (
    <div className="space-y-4">
      { ! history ? (
        <LoadingScreen />
      ) : (
        <div>
          { history.lastRequest && (
            <HistoryItem>
              <button
                className="flex gap-4 w-full"
                onClick={ () => setSince( history.lastRequest.createdAt ) }>
                <time className="font-bold block text-nowrap">
                  Resume { history.lastRequest.humanCreatedAt }
                </time>
                <span className="truncate">"{ history.lastRequest.message }"</span>
              </button>
            </HistoryItem>
          ) }
          { history?.items.length && <HistoryList items={ history.items } /> }
        </div>
      ) }
    </div>
  );
}

function HistoryList( { items }: { items: HistoryItem[] } ) {
  return items.map( item => (
    <HistoryItem key={ item.createdAt }>{ item.humanCreatedAt }</HistoryItem>
  ) );
}

function HistoryItem( { children }: { children: React.ReactNode } ) {
  return <div className="bg-slate-100 rounded px-4 py-2">{ children }</div>;
}
