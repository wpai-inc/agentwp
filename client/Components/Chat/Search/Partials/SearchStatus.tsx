import { useEffect, useMemo } from 'react';
import ChatHeading from '../../Partials/ChatHeading';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import IconOpen from '@material-design-icons/svg/outlined/add.svg?react';
import IconClose from '@material-design-icons/svg/outlined/remove.svg?react';
import { useState } from 'react';

type Status = {
  present: string;
  past: string;
};

export default function SearchStatus( { pending }: { pending: boolean } ) {
  const [ open, setOpen ] = useState( false );
  const [ step, setStep ] = useState( 0 );
  const statuses: Status[] = [
    {
      present: 'Extracting entities...',
      past: 'Extracted entities',
    },
    {
      present: 'Running fuzzy keyword search...',
      past: 'Ran fuzzy keyword search',
    },
    {
      present: 'Running semantic search...',
      past: 'Ran semantic search',
    },
    {
      present: 'Ranking search results...',
      past: 'Ranked search results',
    },
    {
      present: 'Done.',
      past: 'Done.',
    },
  ];

  const status = useMemo( () => statuses[ step ], [ step ] );

  useEffect( () => {
    if ( pending ) {
      const interval = setInterval( () => {
        setStep( step => step + 1 );
      }, 1000 );

      if ( step === 3 ) {
        clearInterval( interval );
      }

      return () => clearInterval( interval );
    }
  }, [ pending, step ] );

  return (
    <div className="space-y-2">
      <ChatHeading explanation="Shows the progress of the AI-powered search process across your WordPress content.">
        Search Steps
      </ChatHeading>
      <Collapsible
        open={ open }
        onOpenChange={ setOpen }
        className="rounded border border-brand-gray text-brand-gray-50">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-2">
          <span>{ status.present }</span>
          { open ? <IconClose className="w-5 h-5" /> : <IconOpen className="w-5 h-5" /> }
        </CollapsibleTrigger>
        <CollapsibleContent>
          { statuses.map( ( status, index ) => (
            <div key={ index } className="p-2 border-t border-brand-gray">
              { status.past }
            </div>
          ) ) }
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
