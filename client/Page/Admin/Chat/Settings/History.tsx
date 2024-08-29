import { useState, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import IconExpand from '@material-design-icons/svg/outlined/expand_more.svg?react';
import { optimistic } from '@/lib/utils';
import { HistoryResponseType } from '@/Providers/ClientProvider';
import { HistoryData } from '@/Types/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';

export default function History() {
  const [ history, setHistory ] = useState< HistoryResponseType >( [] );
  const { getHistory, deleteConversation } = useClient();
  const { since, setSince } = useUserRequests();
  const { clearHistory, setChatSetting, isEmptyConversation } = useChat();

  useEffect( () => {
    fetchHistory( since ?? undefined );
  }, [ since ] );

  async function fetchHistory( since?: string ) {
    const history = await getHistory( since );
    setHistory( history );
  }

  function handleClearConvo() {
    setChatSetting( null );
    clearHistory();
  }

  function handleResume( createdAt: string ) {
    setSince( createdAt );
    setChatSetting( null );
  }

  const timeframes = Object.keys( history );
  return (
    <div className="space-y-4">
      { ! history ? (
        <LoadingScreen />
      ) : (
        <div>
          { timeframes.length > 0 && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="font-bold">Conversations</h2>
                { ! isEmptyConversation && (
                  <button className="underline" onClick={ handleClearConvo }>
                    Clear Current Conversation
                  </button>
                ) }
              </div>
              <div className="space-y-6">
                { timeframes.map( ( timeframe, idx ) => (
                  <Collapsible defaultOpen={ true }>
                    <CollapsibleTrigger className="flex w-full gap-1 items-center mb-2">
                      <IconExpand className="h-5 w-6" />
                      { timeframe }
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <HistoryList items={ history[ timeframe ] } />
                    </CollapsibleContent>
                  </Collapsible>
                ) ) }
              </div>
            </div>
          ) }
        </div>
      ) }
    </div>
  );

  function HistoryList( { items }: { items: HistoryData[] } ) {
    return items.map( convo => <HistoryItem key={ convo.conversationId } convo={ convo } /> );
  }

  function HistoryItem( { convo }: { convo: HistoryData } ) {
    return (
      <button
        className="hover:bg-slate-200 transition-colors p-2 rounded flex justify-between items-center w-full text-left -mx-2"
        onClick={ () => handleResume( convo.conversationCreatedAt ) }>
        <blockquote className="truncate flex-1">{ convo.message }</blockquote>
        <time className="block text-nowrap font-semibold">{ convo.humanCreatedAt }</time>
      </button>
    );
  }
}
