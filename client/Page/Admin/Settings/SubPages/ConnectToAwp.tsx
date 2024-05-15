import adminRequest from "@/lib/adminRequest";
import { useState } from "react";
import type { agentwpSettings } from "@/Types/types";
import { Button } from "@/Components/ui/button";

declare const agentwp_settings: agentwpSettings;

export default function connectToAwp() {
    function isLoggedIn() {
        return !!agentwp_settings.access_token;
    }

    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    const [authorizing, setAuthorizing] = useState(false);

    function authorize() {
        setAuthorizing(true);
        document.location = `${agentwp_settings.api_host}/oauth/authorize?client_id=${agentwp_settings.client_id}&redirect_uri=https%3A%2F%2Fawpwp.ovi.work%2Fwp-admin%2Foptions-general.php%3Fpage%3Dagent-wp-admin-settings&response_type=code&scope=site_connection`;
        setAuthorizing(false);
    }

    const [connecting, setConnecting] = useState(false);

    function connect() {
        setConnecting(true);
        // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
        // this will return the url that AWP can use to get the initial website data
        adminRequest
            .get("agentwp_generate_unique_verification_key")
            .then((response) => {
                document.location = `${
                    agentwp_settings.api_host
                }/connect_site?website=${encodeURIComponent(
                    response.data.home_url
                )}&user_email=${agentwp_settings.user.user_email}&verification_key=${
                    response.data.key
                }`;
            });
    }

    const [disconnecting, setDisconnecting] = useState(false);

    function disconnect() {
        setDisconnecting(true);
        // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
        // this will return the url that AWP can use to get the initial website data
        adminRequest
            .get("agentwp_disconnect_site")
            .then(() => {
                setDisconnecting(false);
                setLoggedIn(false);
                window.location.reload();
            });
    }

    return (
        <div>
            {!agentwp_settings.site_id && (
                <Button
                    onClick={connect}
                    variant="brand"
                    disabled={connecting}
                    isBusy={connecting}
                >
                    {connecting ? "Connecting to awp. Please wait..." : "Connect To AWP"}
                </Button>
            )}
            {agentwp_settings.site_id && (
                <div>
                    Your site is connected to agentwp. Your site ID is{" "}
                    {agentwp_settings.site_id}
                </div>
            )}

            <br />
            {agentwp_settings.site_id && !loggedIn && (
                <div  className="flex gap-4">
                    <Button
                        onClick={authorize}
                        variant="brand"
                        disabled={authorizing}
                        isBusy={authorizing}
                    >
                        Login to AWP
                    </Button>
                    <Button
                        onClick={disconnect}
                        variant="brand"
                        disabled={disconnecting}
                        isBusy={disconnecting}
                    >
                        Disconnect your website from AWP
                    </Button>
                </div>
            )}
            {agentwp_settings.site_id && loggedIn && (
                <div className="flex gap-4">
                    <Button
                        onClick={disconnect}
                        variant="brand"
                        disabled={disconnecting}
                        isBusy={disconnecting}
                    >
                        Disconnect your website from AWP
                    </Button>
                </div>
            )}
        </div>
    );
}
