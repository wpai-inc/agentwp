import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import { Spinner } from '@/Components/Spinner';
import { HistoryData } from '@/Types/types';

export default function LatestConvos() {
  const { getHistory } = useClient();
  const [ isLoading, setIsLoading ] = useState< boolean >( true );
  const [ convos, setConvos ] = useState< HistoryData[] >( [] );

  useEffect( () => {
    async function fetch() {
      const history = await getHistory();
      setConvos( history );
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
        convos.map( convo => <ConvoItem key={ convo.conversationCreatedAt } { ...convo } /> )
      ) : (
        <p>No recent conversations.</p>
      ) }
    </div>
  );
}

function openConvo( since: string ) {
  window.agentwp.dispatchEvent( new CustomEvent( 'awp:chat:since', { detail: { since } } ) );
}

function ConvoItem( convo: HistoryData ) {
  return (
    <button
      className="p-2 w-full text-left odd:bg-gray-100 flex justify-between"
      onClick={ () => openConvo( convo.conversationCreatedAt ) }>
      <blockquote className="truncate">{ convo.message }</blockquote>
      <time className="text-sm font-semibold block text-nowrap ml-3">{ convo.humanCreatedAt }</time>
    </button>
  );
}
