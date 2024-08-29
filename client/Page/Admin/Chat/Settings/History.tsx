import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import IconExpand from '@material-design-icons/svg/outlined/expand_more.svg?react';
import IconLink from '@material-design-icons/svg/outlined/open_in_new.svg?react';
import { HistoryResponseType } from '@/Providers/ClientProvider';
import { HistoryData } from '@/Types/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { usePage } from '@/Providers/PageProvider';

export default function History() {
  const [ history, setHistory ] = useState< HistoryResponseType >( {} );
  const { getHistory } = useClient();
  const { since, setSince } = useUserRequests();
  const { setChatSetting } = useChat();
  const { page } = usePage();
  const [ openStates, setOpenStates ] = useState< { [ key: number ]: boolean } >( {} );

  useEffect( () => {
    fetchHistory( since ?? undefined );
  }, [ since ] );

  async function fetchHistory( since?: string ) {
    const history = await getHistory( since );
    setHistory( history );
    setOpenStates( { 0: true } );
  }

  function HistoryList( { items }: { items: HistoryData[] } ) {
    return items.map( convo => <HistoryItem key={ convo.conversationId } convo={ convo } /> );
  }

  function HistoryItem( { convo }: { convo: HistoryData } ) {
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

  const timeframes = Object.keys( history );

  return timeframes.length === 0 ? (
    <LoadingScreen />
  ) : (
    <div className="flex h-full flex-col">
      { timeframes.map( ( timeframe, idx ) => {
        const isOpen = !! openStates[ idx ];
        return (
          <Collapsible
            open={ isOpen }
            onOpenChange={ () => handleToggle( idx ) }
            key={ idx }
            className="mb-6">
            <CollapsibleTrigger className="mb-2 flex w-full items-center gap-1">
              <IconExpand className={ cn( 'h-5 w-6', { 'rotate-180': isOpen } ) } />
              { timeframe }
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HistoryList items={ history[ timeframe ] } />
            </CollapsibleContent>
          </Collapsible>
        );
      } ) }
      <Button className="mt-auto" asChild>
        <a href={ page.settings_page }>
          View all history <IconLink className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
