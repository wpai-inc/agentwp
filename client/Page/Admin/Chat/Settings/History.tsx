import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import IconExpand from '@material-design-icons/svg/outlined/expand_more.svg?react';
import { HistoryResponseType } from '@/Providers/ClientProvider';
import { HistoryData } from '@/Types/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import { cn } from '@/lib/utils';

export default function History() {
  const [ history, setHistory ] = useState< HistoryResponseType >( {} );
  const { getHistory } = useClient();
  const { since, setSince } = useUserRequests();
  const { setChatSetting } = useChat();
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
        className="hover:bg-brand-gray-20 transition-colors p-2 rounded flex justify-between items-center w-full text-left -mx-2"
        onClick={ () => handleResume( convo.conversationCreatedAt ) }>
        <blockquote className="truncate flex-1">{ convo.message }</blockquote>
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
    <div className="space-y-6">
      { timeframes.map( ( timeframe, idx ) => {
        const isOpen = !! openStates[ idx ];
        return (
          <Collapsible open={ isOpen } onOpenChange={ () => handleToggle( idx ) } key={ idx }>
            <CollapsibleTrigger className="flex w-full gap-1 items-center mb-2">
              <IconExpand className={ cn( 'h-5 w-6', { 'rotate-180': isOpen } ) } />
              { timeframe }
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HistoryList items={ history[ timeframe ] } />
            </CollapsibleContent>
          </Collapsible>
        );
      } ) }
    </div>
  );
}
