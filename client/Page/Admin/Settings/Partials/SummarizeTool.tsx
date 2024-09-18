import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function SummarizeTool() {
  const [ summarizing, setSummarizing ] = useState( false );
  const { restReq } = useRestRequest();

  function start() {
    setSummarizing( true );
    restReq.post( 'tools_summarize' ).then( () => setSummarizing( false ) );
  }

  return (
    <Button isBusy={ summarizing } onClick={ start }>
      Resummarize
    </Button>
  );
}
