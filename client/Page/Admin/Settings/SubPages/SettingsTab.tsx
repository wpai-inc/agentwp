import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { usePage } from '@/Providers/PageProvider';
import GeneralSettings from '../Partials/GeneralSettings';
import DataList, { DataListItem } from '@/Components/ui/dl';
import ChatSettings from '../Partials/ChatSettings';
import Tools from '../Partials/Tools';

export default function SettingsTab() {
  /**
   * Variables
   */
  const { restReq, tryRequest } = useRestRequest();
  const { page } = usePage();
  const isLoggedIn = page.account;

  /**
   * States
   */
  const [ loggedIn, setLoggedIn ] = useState< boolean >( !! isLoggedIn );
  const [ authorizing, setAuthorizing ] = useState( false );
  const [ connecting, setConnecting ] = useState( false );
  const [ disconnecting, setDisconnecting ] = useState( false );

  /**
   * Methods
   */
  async function authorize() {
    setAuthorizing( true );
    const authorize_url = await tryRequest( 'get', 'oauth_authorize' );
    console.log( authorize_url );

    window.location = authorize_url.data.url;
  }

  async function connect() {
    setConnecting( true );
    const connect_url = await tryRequest( 'get', 'oauth_connect' );
    console.log( connect_url );

    window.location = connect_url.data.url;
  }

  function disconnect() {
    setDisconnecting( true );
    restReq.get( 'disconnect_site' ).then( () => {
      setDisconnecting( false );
      setLoggedIn( false );
      window.location.reload();
    } );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Section header="Plugin Settings">
        <DataList>
          { page.account && ! loggedIn && (
            <DataListItem label={ <label className="font-bold">Login to AWP</label> }>
              <Button
                onClick={ authorize }
                variant="brand"
                disabled={ authorizing }
                isBusy={ authorizing }>
                Login
              </Button>
            </DataListItem>
          ) }

          { page.account && (
            <DataListItem
              label={
                <div>
                  <h3 className="font-bold">Site Connection</h3>
                  <p className="text-sm">Your connected site ID is { page.site_id }</p>
                </div>
              }>
              <Button
                onClick={ disconnect }
                variant="brand"
                disabled={ disconnecting }
                isBusy={ disconnecting }>
                Disconnect Site
              </Button>
            </DataListItem>
          ) }
          { ! page.account && (
            <DataListItem label="Connect Your Site">
              <Button
                onClick={ connect }
                variant="brand"
                disabled={ connecting }
                isBusy={ connecting }>
                { connecting ? 'Connecting to awp. Please wait...' : 'Connect To AWP' }
              </Button>
            </DataListItem>
          ) }
          <GeneralSettings />
        </DataList>
      </Section>

      <Section header="Conversation Settings">
        <DataList>
          <ChatSettings />
        </DataList>
      </Section>

      <Section header="Tools">
        <DataList>
          <Tools />
        </DataList>
      </Section>
    </div>
  );
}

function SectionHeader( { children }: { children: React.ReactNode } ) {
  return <h2 className="text-xl p-4 border-b border-brand-gray">{ children }</h2>;
}

function Section( { children, header }: { children: React.ReactNode; header: string } ) {
  return (
    <div className="space-y-4 border border-brand-gray rounded-xl bg-white">
      <SectionHeader>{ header }</SectionHeader>
      <div className="p-4">{ children }</div>
    </div>
  );
}
