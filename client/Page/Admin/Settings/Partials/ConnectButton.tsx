import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { usePage } from '@/Providers/PageProvider';

export default function ConnectButton() {
  const { tryRequest } = useRestRequest();

  const [ connecting, setConnecting ] = useState( false );

  async function connect() {
    setConnecting( true );
    const connect_url = await tryRequest( 'get', 'oauth_connect' );
    window.location = connect_url.data.data.url;
  }

  return (
    <>
      <Button
        disabled={ connecting }
        onClick={ connect }
        className=" w-full"
        variant="brand"
        isBusy={ connecting }>
        Connect AI Services
      </Button>
    </>
  );
}
