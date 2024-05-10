import { useState } from "react";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import adminRequest from "@/lib/adminRequest";

export function ManualAwpActivation() {

    const [fieldsVisible, setFieldsVisible] = useState(false);
    const [apiKey, setApiKey] = useState('');

    function showFields() {
        setFieldsVisible(!fieldsVisible);
    }

    function saveManualToken() {
        adminRequest.post('/agentwp_manual_activation', { apiKey })
    }

    return (
        <>
            <Button
                onClick={showFields}
                className="button w-full"
            >
                Manually Connect AI services
            </Button>
            {fieldsVisible && (
                <div>
                    <div><a target="_blank" href="https://awp.ovi.work/manually_connect_site">Get your api key</a></div>
                    <div>
                        <Label>API key</Label>
                        <textarea value={apiKey} className="w-full block" onChange={(ev) => setApiKey(ev.target.value)} />
                    </div>
                    <Button className="button w-full" onClick={() => saveManualToken()}>Connect</Button>
                </div>
            )}
        </>
    );
}
