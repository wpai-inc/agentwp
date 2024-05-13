import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/Shared/App";
import { PageProvider } from "@/Providers/PageProvider";
import Settings from "./Settings";
import Wizard from "./Wizard";
import type { agentwpSettings } from "@/Types/types";

const rootElement = document.getElementById("agent-wp-admin-settings");

declare const agent_wp_admin_settings: any;
declare const agentwp_settings: agentwpSettings;


if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <PageProvider page={agent_wp_admin_settings}>
                <App>
                    {agentwp_settings?.onboard_completed && <Settings />}
                    {!agentwp_settings?.onboard_completed && <Wizard />}

                </App>
            </PageProvider>
        </React.StrictMode>
    );
} else {
    // Handle the case where the root element is not found
    console.error("Root element not found");
}
