import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { usePage } from '@/Providers/PageProvider';

export default function ConnectButton() {
  const page = usePage();

  const adminRequest = useAdminRoute();

  const [connecting, setConnecting] = useState(false);

  function connect() {
    setConnecting(true);
    // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
    // this will return the url that AWP can use to get the initial website data
    adminRequest
      .get('agentwp/v1/get_unique_verification_key')
      .then((response: any) => {
        console.log(response.data);
        // prettier-ignore
        document.location = `${page.api_host}/connect_site?website=${encodeURIComponent(response.data.data.home_url)}&user_email=${page.user.user_email}&verification_key=${response.data.data.key}`;
      });
  }

  return (
    <>
      <Button
        disabled={connecting}
        onClick={connect}
        className=" w-full"
        variant="brand"
        isBusy={connecting}
      >
        Connect AI Services
      </Button>
    </>
  );
}
