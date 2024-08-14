import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import type { HistoryItem } from '@/Providers/ClientProvider';
import { Spinner } from '@/Components/Spinner';

export default function LatestConvos() {
  const { getHistory } = useClient();

  const [ isLoading, setIsLoading ] = useState< boolean >( true );
  const [ convos, setConvos ] = useState< HistoryItem[] >( [] );

  useEffect( () => {
    async function fetch() {
      const history = await getHistory();
      setConvos( history.items.data );
      setIsLoading( false );
    }

    fetch();
  }, [] );

  return (
    <div>
      { isLoading ? (
        <div className="min-h-10 flex items-center justify-center">
          <Spinner show={ true } />
        </div>
      ) : convos.length > 0 ? (
        convos.map( ( convo: HistoryItem ) => <ConvoItem { ...convo } /> )
      ) : (
        <p>No recent conversations.</p>
      ) }
    </div>
  );
}

function ConvoItem( convo: HistoryItem ) {
  return (
    <div className="p-2 odd:bg-gray-100">
      <time>{ convo.humanCreatedAt }</time>
    </div>
  );
}
