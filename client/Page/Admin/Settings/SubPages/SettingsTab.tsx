import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { usePage } from '@/Providers/PageProvider';
import GeneralSettings from '../Partials/GeneralSettings';
import DataList, { DataListItem } from '@/Components/ui/dl';

export default function SettingsTab() {
  /**
   * Variables
   */
  const { adminRequest } = useRestRequest();
  const { page } = usePage();
  const isLoggedIn = !! page.access_token;

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
    adminRequest.get( 'get_unique_verification_key' ).then( ( response: any ) => {
      // prettier-ignore
      document.location = `${page.api_host}/connect_site?website=${encodeURIComponent(response.data.data.home_url)}&user_email=${page.user.user_email}&verification_key=${response.data.data.key}`;
    } );
  }

  function disconnect() {
    setDisconnecting( true );
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
    adminRequest.get( 'disconnect_site' ).then( () => {
      setDisconnecting( false );
      setLoggedIn( false );
      window.location.reload();
    } );
  }

  return (
    <div>
      { ! page.site_id && (
        <Button onClick={ connect } variant="brand" disabled={ connecting } isBusy={ connecting }>
          { connecting ? 'Connecting to awp. Please wait...' : 'Connect To AWP' }
        </Button>
      ) }
      <DataList>
        <GeneralSettings />
        { page.site_id && loggedIn && (
          <DataListItem
            label={ <p>Your site is connected to agentwp. Your site ID is { page.site_id }</p> }>
            <Button
              onClick={ disconnect }
              variant="brand"
              disabled={ disconnecting }
              isBusy={ disconnecting }>
              Disconnect your website from AWP
            </Button>
          </DataListItem>
        ) }
      </DataList>

      { page.site_id && ! loggedIn && (
        <div className="flex gap-4">
          <Button
            onClick={ authorize }
            variant="brand"
            disabled={ authorizing }
            isBusy={ authorizing }>
            Login to AWP
          </Button>
          <Button
            onClick={ disconnect }
            variant="brand"
            disabled={ disconnecting }
            isBusy={ disconnecting }>
            Disconnect your website from AWP
          </Button>
        </div>
      ) }
    </div>
  );
}
