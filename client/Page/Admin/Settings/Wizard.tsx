import ConnectAiService from "./Wizard/ConnectAiService";
import CheckedText from "@/Icon/CheckedText";
import apiRequest from "@/lib/apiRequest";
import type { agentwpSettings } from "@/Types/types";
import { useEffect, useState } from "react";
import UserAccess from "@/Page/Admin/Settings/Wizard/UserAccess";
import AboutThePlugin from "@/Page/Admin/Settings/Wizard/AboutThePlugin";

declare const agentwp_settings: agentwpSettings;

export default function Wizard() {

    const [steps, setSteps] = useState([
        {
            text: "Install Plugin",
            checked: true,
            active: false
        },
        {
            text: "Connect AI",
            checked: false,
            active: true,
        },
        {
            text: "User Access",
            checked: false,
            active: false,
        },
        {
            text: "About the Plugin",
            checked: false,
            active: false,
        }
    ]);

    const [isConnectedChecked, setIsConnectedChecked] = useState(false);

    function isConnected() {
        return apiRequest.get(`/api/sites/${agentwp_settings.site_id}`);
    }

    function goToAboutPage() {
        setSteps(steps => steps.map((step, index) => {
            if (index === 2) {
                return { ...step, checked: true, active: false };
            }
            if (index === 3) {
                return { ...step, active: true };
            }
            return step;
        }));

    }

    useEffect(() => {
        isConnected().then(() => {
            setSteps(steps => steps.map((step, index) => {
                if (index === 1) {
                    return { ...step, checked: true, active: false };
                }
                if (index === 2) {
                    return { ...step, active: true };
                }
                return step;
            }));
            setIsConnectedChecked(true);
        }).catch(() => {
            setIsConnectedChecked(true);
        })
    }, []);

    return (
        <div>
            <div className="flex justify-center items-center gap-4 mt-8">
                {steps.map((step, index) => (
                    <CheckedText key={index} active={step.active} checked={step.checked} text={step.text} />
                ))}
            </div>
            {isConnectedChecked &&
            <>
                {steps[1].active && <ConnectAiService />}
                {steps[2].active && <UserAccess onGoToAboutPage={() => goToAboutPage()}  />}
                {steps[3].active && <AboutThePlugin />}
            </>
            }
        </div>
    );
}
