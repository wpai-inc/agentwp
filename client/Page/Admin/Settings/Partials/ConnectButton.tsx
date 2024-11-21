import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function ConnectButton( {
  accepted,
  className,
  ...props
}: { accepted: boolean; className?: string } & React.ButtonHTMLAttributes< HTMLButtonElement > ) {
  const { t } = useTranslation();
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
      className={ cn( 'w-full', ! accepted && 'cursor-not-allowed', className ) }
      variant="brand"
      size="lg"
      isBusy={ connecting }
      { ...props }>
      { t( 'Connect AI Services' ) }
    </Button>
  );
}
