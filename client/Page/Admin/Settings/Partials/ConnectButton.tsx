import { useState } from "react";
import adminRequest from "@/lib/adminRequest.js";
import type { agentwpSettings } from "@/Types/types.js";
import { Button } from "@/Components/ui/button";

declare const agentwp_settings: agentwpSettings;
export default function ConnectButton() {
    const [connecting, setConnecting] = useState(false);

    function connect() {
        setConnecting(true);
        // make a fetch request that will generate the uniqueue url is generated. From that url AWP can get the initial website data
        // this will return the url that AWP can use to get the initial website data
        adminRequest
            .get("agentwp_generate_unique_verification_key")
            .then((response) => {
                console.log(response.data);
                document.location = `${agentwp_settings.api_host
                }/connect_site?website=${encodeURIComponent(
                    response.data.home_url
                )}&user_email=${agentwp_settings.user.user_email}&verification_key=${response.data.key
                }`;
            });
    }
  return (
    <>
        <Button disabled={connecting} onClick={connect} className="button w-full">Connect AI Services</Button>
    </>
  );
}
