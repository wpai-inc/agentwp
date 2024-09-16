import { useState, useEffect } from 'react';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import IconExpand from '@material-design-icons/svg/outlined/expand_more.svg?react';
import IconLink from '@material-design-icons/svg/outlined/open_in_new.svg?react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function History() {
  const [ history, setHistory ] = useState< App.Data.HistoryChronoGroupData[] >( [] );
  const { apiRequest } = useRestRequest();
  const [ loading, setLoading ] = useState( true );
  const { since, setSince } = useUserRequests();
  const { setChatSetting } = useChat();
  const { page } = usePage();
  const [ openStates, setOpenStates ] = useState< { [ key: number ]: boolean } >( {} );

  useEffect( () => {
    fetchHistory( since ?? undefined );
  }, [ since ] );

  async function fetchHistory( since?: string ) {
    const history = await apiRequest< App.Data.HistoryChronoGroupData[] >( 'convoHistory', {
      since,
    } );
    setHistory( history );
    setOpenStates( { 0: true } );
    setLoading( false );
  }

  function HistoryList( { items }: { items: App.Data.HistoryData[] } ) {
    return items.map( item => <HistoryItem key={ item.conversationId } { ...item } /> );
  }

  function HistoryItem( convo: App.Data.HistoryData ) {
    return (
      <button
        className="-mx-2 flex w-full items-center justify-between rounded p-2 text-left transition-colors hover:bg-brand-gray-20"
        onClick={ () => handleResume( convo.conversationCreatedAt ) }>
        <blockquote className="flex-1 truncate">{ convo.message }</blockquote>
        <time className="block text-nowrap font-semibold">{ convo.humanCreatedAt }</time>
      </button>
    );
  }

  function handleToggle( idx: number ) {
    setOpenStates( prev => ( {
      ...prev,
      [ idx ]: ! prev[ idx ],
    } ) );
  }

  function handleResume( createdAt: string ) {
    setSince( createdAt );
    setChatSetting( null );
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="flex h-full flex-col">
      { history.length > 0 ? (
        history.map( ( chronoGroup, idx ) => {
          const isOpen = !! openStates[ idx ];
          return (
            <Collapsible
              open={ isOpen }
              onOpenChange={ () => handleToggle( idx ) }
              key={ idx }
              className="mb-6">
              <CollapsibleTrigger className="mb-2 flex w-full items-center gap-1">
                <IconExpand className={ cn( 'h-5 w-6', { 'rotate-180': isOpen } ) } />
                { chronoGroup.group }
              </CollapsibleTrigger>
              <CollapsibleContent>
                <HistoryList items={ chronoGroup.history } />
              </CollapsibleContent>
            </Collapsible>
          );
        } )
      ) : (
        <p className="text-center">No history found</p>
      ) }
      <Button className="mt-auto" asChild>
        <a href={ page.settings_page }>
          View all history <IconLink className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
