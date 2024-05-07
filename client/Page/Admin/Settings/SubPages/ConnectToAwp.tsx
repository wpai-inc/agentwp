import adminRequest from '@/lib/adminRequest';
import { Button } from '@wordpress/components';
import { useState } from 'react';

declare const agentwp_settings: agentwpSettings;

export default function connectToAwp() {
  function isLoggedIn() {
    return !!agentwp_settings.access_token;
  }
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const [authorizing, setAuthorizing] = useState(false);
  function authorize() {
    setAuthorizing(true);
    document.location = `${agentwp_settings.api_host}/oauth/authorize?client_id=${agentwp_settings.client_id}&redirect_uri=https%3A%2F%2Fawpwp.ovi.work%2Fwp-admin%2Foptions-general.php%3Fpage%3Dagent-wp-admin-settings&response_type=code&scope=site`;
    setAuthorizing(false);
  }

  const [connecting, setConnecting] = useState(false);
  function connect() {
    setConnecting(true);
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
    adminRequest
      .get('?action=agentwp_generate_unique_verification_key')
      .then((response) => {
        document.location = `${
          agentwp_settings.api_host
        }/connect_site?website=${encodeURIComponent(
          response.data.home_url,
        )}&user_email=${agentwp_settings.user.user_email}&uid=${
          response.data.key
        }`;
      });
  }

  function logout() {
    adminRequest.post('?action=agentwp_logout');
    setLoggedIn(false);
  }

  return (
    <div>
      {!agentwp_settings.site_id && (
        <Button
          onClick={connect}
          variant="primary"
          className="button"
          disabled={connecting}
          isBusy={connecting}
        >
          {connecting ? 'Connecting to awp. Please wait...' : 'Connect To AWP'}
        </Button>
      )}
      {agentwp_settings.site_id && (
        <div>
          Your site is connected to agentwp. Your site ID is{' '}
          {agentwp_settings.site_id}
        </div>
      )}

      <br />
      {agentwp_settings.site_id && !loggedIn && (
        <Button
          onClick={authorize}
          variant="primary"
          className="button"
          disabled={authorizing}
          isBusy={authorizing}
        >
          Login to AWP
        </Button>
      )}
      {agentwp_settings.site_id && loggedIn && (
        <Button onClick={logout} isDestructive className="button">
          Log out
        </Button>
      )}
    </div>
  );
}
