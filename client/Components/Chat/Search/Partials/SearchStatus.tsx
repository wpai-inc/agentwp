import { useEffect, useMemo } from 'react';
import ChatHeading from '../../Partials/ChatHeading';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import IconOpen from '@material-design-icons/svg/outlined/add.svg?react';
import IconClose from '@material-design-icons/svg/outlined/remove.svg?react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Status = {
  present: string;
  past: string;
};

export default function SearchStatus( { pending }: { pending: boolean } ) {
  const [ open, setOpen ] = useState( false );
  const [ step, setStep ] = useState( 0 );
  const { t } = useTranslation();
  const statuses: Status[] = [
    {
      present: t( 'Extracting entities...' ),
      past: t( 'Extracted entities' ),
    },
    {
      present: t( 'Running fuzzy keyword search...' ),
      past: t( 'Ran fuzzy keyword search' ),
    },
    {
      present: t( 'Running semantic search...' ),
      past: t( 'Ran semantic search' ),
    },
    {
      present: t( 'Ranking search results...' ),
      past: t( 'Ranked search results' ),
    },
    {
      present: t( 'Done.' ),
      past: t( 'Done.' ),
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
      <ChatHeading
        explanation={ t(
          'Shows the progress of the AI-powered search process across your WordPress content.',
        ) }>
        { t( 'Search Steps' ) }
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
