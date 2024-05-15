import { FormEvent, useState } from "react";
import adminRequest from "@/lib/adminRequest";
import { Button } from "@/Components/ui/button";
import Textarea from "@/Components/ui/Textarea";
import * as Form from "@radix-ui/react-form";
import { agentwpSettings } from "@/Types/types";

declare const agentwp_settings: agentwpSettings;

export function ManualAwpActivation() {

    const [fieldsVisible, setFieldsVisible] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [saving, setSaving] = useState(false);
    const [serverErrors, setServerErrors] = useState({
        apiKey: "",
    });

    function showFields() {
        setFieldsVisible(!fieldsVisible);
    }

    function saveManualToken(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        adminRequest.post("/agentwp_manual_activation", { apiKey })
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    setServerErrors({...serverErrors, apiKey: data.data.message});
                    console.error(data.data.message);
                }else{
                    setServerErrors({...serverErrors, apiKey: ""});
                }
                setSaving(false);
            }).catch((err) => {
            console.error(err);
            setSaving(false);
            setServerErrors({...serverErrors, apiKey: err.response.data.message});
        });
    }


    return (
        <>
            <Button
                onClick={showFields}
                className="w-full"
                variant="brand"
            >
                Manually Connect AI services
            </Button>
            {fieldsVisible && (
                <Form.Root
                    onSubmit={(event) => saveManualToken(event)}
                    onClearServerErrors={() => setServerErrors({...serverErrors, apiKey: ""})}
                >
                    <Textarea
                        name="apiKey"
                        value={apiKey}
                        placeholder={"Enter your API key"}
                        label={"API key"}
                        required={true}
                        onChange={(value) => setApiKey(value)}
                        validateMessage={{
                            missing: "Please enter your API key",
                            custom: serverErrors.apiKey
                        }}
                        labelInstructions={<a target="_blank" className="underline" href={`${agentwp_settings.api_host}/manually_connect_site?url=${encodeURIComponent(agentwp_settings.home_url)}`}>Get your api key</a>}
                    ></Textarea>
                    <Form.Submit asChild>
                        <Button
                            className="w-full mt-4"
                            variant="brand"
                            isBusy={saving}
                        >Connect</Button>
                    </Form.Submit>
                </Form.Root>
            )}
        </>
    );
}
