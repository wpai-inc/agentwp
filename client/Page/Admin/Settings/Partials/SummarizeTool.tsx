import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { useNotifications } from '@/Providers/NotificationProvider';
import { useTranslation } from 'react-i18next';

export default function SummarizeTool() {
  const { t } = useTranslation();
  const [ summarizing, setSummarizing ] = useState( false );
  const { restReq } = useRestRequest();
  const { notify } = useNotifications();

  function start() {
    setSummarizing( true );
    restReq
      .post( 'tools_summarize' )
      .then( data => {
        notify( data.data.data );
      } )
      .catch( () => {
        notify( t( 'Failed to summarize content' ) );
      } )
      .finally( () => setSummarizing( false ) );
  }

  return (
    <Button isBusy={ summarizing } onClick={ start }>
      { t( 'Resummarize' ) }
    </Button>
  );
}
