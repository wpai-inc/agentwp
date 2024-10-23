import { useState, useEffect, Fragment } from 'react';
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
    <div className="max-h-[calc(100vh-275px)] min-h-[calc(100%-2rem)] overflow-y-auto p-3">
      { isLoading ? (
        <div className="flex min-h-10 items-center justify-center">
          <Spinner show={ true } />
        </div>
      ) : historyGroups.length > 0 ? (
        <div className="flex flex-col">
          { historyGroups.map( historyGroup => (
            <Fragment key={ historyGroup.group }>
              <h3>{ historyGroup.group }</h3>
              { historyGroup.history.map( convo => (
                <ConvoItem key={ convo.id } { ...convo } />
              ) ) }
            </Fragment>
          ) ) }
        </div>
      ) : (
        <p>No recent conversations.</p>
      ) }
    </div>
  );
}

function openConvo( convoId: number ) {
  window.agentwp.dispatchEvent( new CustomEvent( 'awp:chat:convo', { detail: { convoId } } ) );
}

function ConvoItem( convo: App.Data.ConversationData ) {
  return (
    <button
      className="flex w-full justify-between p-2 text-left odd:bg-brand-gray-20"
      onClick={ () => openConvo( convo.id ) }>
      <blockquote className="truncate">
        { convo.lastMessage ? convo.lastMessage : 'Empty' }
      </blockquote>
      <time className="ml-3 block text-nowrap text-sm font-semibold">{ convo.humanCreatedAt }</time>
    </button>
  );
}
