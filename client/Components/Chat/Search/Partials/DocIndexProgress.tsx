import { useState } from 'react';
import { Progress } from '@/Components/ui/progress';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/Components/ui/collapsible';
import IconAdd from '@material-design-icons/svg/outlined/add.svg?react';
import IconRemove from '@material-design-icons/svg/outlined/remove.svg?react';
import { useDocIndexStatus } from '@/Providers/DocIndexStatusProvider';
import { useTranslation } from 'react-i18next';

export default function DocIndexProgress() {
  const { total, indexed, percent, current, remaining } = useDocIndexStatus();
  const [ open, setOpen ] = useState( false );
  const { t } = useTranslation();

  if ( current ) {
    return (
      <>
        <Collapsible open={ open } onOpenChange={ setOpen }>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <span>
              { t( 'Indexing' ) } <strong>{ current.docType }</strong>: { percent }% ({ indexed }/
              { total })
            </span>
            <span className="text-brand-gray-50">
              { ! open && <IconAdd className="w-4 h-4" /> }
              { open && <IconRemove className="w-4 h-4" /> }
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p>
              { t( 'Up next' ) }: { remaining.map( doc => doc.docType ).join( ', ' ) }
            </p>
          </CollapsibleContent>
        </Collapsible>
        <Progress className="mt-2" value={ percent } />
      </>
    );
  }
}
