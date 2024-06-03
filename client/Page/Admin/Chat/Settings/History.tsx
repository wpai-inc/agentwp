import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import type { HistoryType } from '@/Providers/ClientProvider';

export default function History() {
  const [ history, setHistory ] = useState< HistoryType[] >( [] );
  const { getHistory } = useClient();

  useEffect( () => {
    fetchHistory();
  }, [] );

  async function fetchHistory() {
    const history = await getHistory();
    setHistory( history );
  }

  return (
    <div className="space-y-4">
      { ! history
        ? 'Loading...'
        : history.map( item => (
            <p key={ item.created_at } className="bg-slate-100 rounded px-4 py-2">
              { item.human_created_at }
            </p>
          ) ) }
    </div>
  );
}
