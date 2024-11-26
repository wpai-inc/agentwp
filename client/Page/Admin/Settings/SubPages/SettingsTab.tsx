import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { usePage } from '@/Providers/PageProvider';
import GeneralSettings from '../Partials/GeneralSettings';
import DataList, { DataListItem } from '@/Components/ui/dl';
import ChatSettings from '../Partials/ChatSettings';
import Tools from '../Partials/Tools';
import RestrictURLsSettings from '../Partials/RestrictURLsSettings';
import { useAccount } from '@/Providers/AccountProvider';
import { useTranslation } from 'react-i18next';

export default function SettingsTab() {
  const { t } = useTranslation();

  /**
   * Variables
   */
  const { restReq, tryRequest } = useRestRequest();
  const { page, isConnected } = usePage();
  const { account } = useAccount();

  /**
   * States
   */
  const [ loggedIn, setLoggedIn ] = useState< boolean >( isConnected );
  const [ authorizing, setAuthorizing ] = useState( false );
  const [ connecting, setConnecting ] = useState( false );
  const [ disconnecting, setDisconnecting ] = useState( false );

  /**
   * Methods
   */
  async function authorize() {
    setAuthorizing( true );
    const { data } = await tryRequest( 'get', 'oauth_authorize' );
    window.location = data.url;
  }

  async function connect() {
    setConnecting( true );
    const { data } = await tryRequest( 'get', 'oauth_connect' );
    window.location = data.url;
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
          { account && ! loggedIn && (
            <DataListItem label={ <label className="font-bold">{ t( 'Login to AWP' ) }</label> }>
              <Button
                onClick={ authorize }
                variant="brand"
                disabled={ authorizing }
                isBusy={ authorizing }>
                { t( 'Login' ) }
              </Button>
            </DataListItem>
          ) }

          { loggedIn ? (
            <DataListItem
              label={
                <div>
                  <h3 className="font-bold">{ t( 'Site Connection' ) }</h3>
                  <p className="text-sm">
                    { t( 'Your connected site ID is' ) } { page.site_id }
                  </p>
                </div>
              }>
              <Button
                onClick={ disconnect }
                variant="brand"
                disabled={ disconnecting }
                isBusy={ disconnecting }>
                { t( 'Disconnect Site' ) }
              </Button>
            </DataListItem>
          ) : (
            <DataListItem label={ t( 'Connect Your Site' ) }>
              <Button
                onClick={ connect }
                variant="brand"
                disabled={ connecting }
                isBusy={ connecting }>
                { connecting ? t( 'Connecting to awp. Please wait...' ) : t( 'Connect To AWP' ) }
              </Button>
            </DataListItem>
          ) }
          <GeneralSettings />
          <RestrictURLsSettings />
        </DataList>
      </Section>

      <Section header={ t( 'Conversation Settings' ) }>
        <DataList>
          <ChatSettings />
        </DataList>
      </Section>

      <Section header={ t( 'Tools' ) }>
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
