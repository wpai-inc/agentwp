import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { usePage } from '@/Providers/PageProvider';

export default function connectToAwp() {
  const adminRequest = useAdminRoute();
  const { page } = usePage();

  function isLoggedIn() {
    return !! page.access_token;
  }

  const [ loggedIn, setLoggedIn ] = useState( isLoggedIn() );

  const [ authorizing, setAuthorizing ] = useState( false );

  function authorize() {
    setAuthorizing( true );
    document.location = `${ page.api_host }/oauth/authorize?client_id=${ page.client_id }&redirect_uri=https%3A%2F%2Fawpwp.ovi.work%2Fwp-admin%2Foptions-general.php%3Fpage%3Dagent-wp-admin-settings&response_type=code&scope=site_connection`;
    setAuthorizing( false );
  }

  const [ connecting, setConnecting ] = useState( false );

  function connect() {
    setConnecting( true );
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
    adminRequest.get( '/agentwp/v1/get_unique_verification_key' ).then( ( response: any ) => {
      // prettier-ignore
      document.location = `${page.api_host}/connect_site?website=${encodeURIComponent(response.data.data.home_url)}&user_email=${page.user.user_email}&verification_key=${response.data.data.key}`;
    } );
  }

  const [ disconnecting, setDisconnecting ] = useState( false );

  function disconnect() {
    setDisconnecting( true );
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
    adminRequest.get( '/agentwp/v1/disconnect_site' ).then( () => {
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
      { page.site_id && (
        <div>Your site is connected to agentwp. Your site ID is { page.site_id }</div>
      ) }

      <br />
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
      { page.site_id && loggedIn && (
        <div className="flex gap-4">
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
