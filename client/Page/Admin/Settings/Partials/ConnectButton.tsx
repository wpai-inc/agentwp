import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function ConnectButton( { accepted }: { accepted: boolean } ) {
  const { tryRequest } = useRestRequest();

  const [ connecting, setConnecting ] = useState( false );

  async function connect() {
    setConnecting( true );
    const { data } = await tryRequest( 'get', 'oauth_connect' );
    window.location = data.url;
  }

  return (
    <Button
      disabled={ connecting || ! accepted }
      onClick={ connect }
      className="w-full"
      variant="brand"
      size="lg"
      isBusy={ connecting }>
      Connect AI Services
    </Button>
  );
}
