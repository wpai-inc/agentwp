import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { useNotifications } from '@/Providers/NotificationProvider';

export default function SummarizeTool() {
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
        notify( 'Failed to summarize content' );
      } )
      .finally( () => setSummarizing( false ) );
  }

  return (
    <Button isBusy={ summarizing } onClick={ start }>
      Resummarize
    </Button>
  );
}
