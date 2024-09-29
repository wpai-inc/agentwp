import { useState, useEffect } from 'react';
import { Spinner } from '@/Components/Spinner';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function LatestConvos() {
  const { proxyApiRequest } = useRestRequest();
  const [ isLoading, setIsLoading ] = useState< boolean >( true );
  const [ historyGroups, setHistoryGroups ] = useState< App.Data.HistoryChronoGroupData[] >( [] );

  useEffect( () => {
    async function fetch() {
      const history = await proxyApiRequest< App.Data.HistoryChronoGroupData[] >( 'convoHistory' );
      setHistoryGroups( history );
      setIsLoading( false );
    }

    fetch();
  }, [] );

  return (
    <div className="max-h-[calc(100vh-275px)] min-h-[calc(100%-2rem)] overflow-y-auto">
      { isLoading ? (
        <div className="min-h-10 flex items-center justify-center">
          <Spinner show={ true } />
        </div>
      ) : historyGroups.length > 0 ? (
        <div className="flex flex-col">
          { historyGroups.map( historyGroup => (
            <>
              <h3>{ historyGroup.group }</h3>
              { historyGroup.history.map( convo => (
                <ConvoItem key={ historyGroup.group } { ...convo } />
              ) ) }
            </>
          ) ) }
        </div>
      ) : (
        <p>No recent conversations.</p>
      ) }
    </div>
  );
}

function openConvo( since: string ) {
  window.agentwp.dispatchEvent( new CustomEvent( 'awp:chat:since', { detail: { since } } ) );
}

function ConvoItem( convo: App.Data.HistoryData ) {
  return (
    <button
      className="p-2 w-full text-left odd:bg-brand-gray-20 flex justify-between"
      onClick={ () => openConvo( convo.conversationCreatedAt ) }>
      <blockquote className="truncate">{ convo.message }</blockquote>
      <time className="text-sm font-semibold block text-nowrap ml-3">{ convo.humanCreatedAt }</time>
    </button>
  );
}
