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
  const { restReq } = useRestRequest();
  const { page } = usePage();
  const isLoggedIn = page.account;

  /**
   * States
   */
  const [ loggedIn, setLoggedIn ] = useState( isLoggedIn );
  const [ authorizing, setAuthorizing ] = useState( false );
  const [ connecting, setConnecting ] = useState( false );
  const [ disconnecting, setDisconnecting ] = useState( false );

  /**
   * Methods
   */
  function authorize() {
    const redirectUri = encodeURIComponent(
      page.admin_route + 'admin.php?page=agentwp-admin-settings',
    );

    setAuthorizing( true );
    document.location = `${ page.api_host }/oauth/authorize?client_id=${ page.client_id }&redirect_uri=${ redirectUri }&response_type=code&scope=site_connection`;
    setAuthorizing( false );
  }

  function connect() {
    setConnecting( true );
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
    restReq.get( 'get_unique_verification_key' ).then( ( response: any ) => {
      // prettier-ignore
      document.location = `${page.api_host}/connect_site?website=${encodeURIComponent(response.data.data.home_url)}&user_email=${page.user.user_email}&verification_key=${response.data.data.key}`;
    } );
  }

  function disconnect() {
    setDisconnecting( true );
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
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
