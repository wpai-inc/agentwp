import ConnectToAwp from "./SubPages/ConnectToAwp";
import * as Tabs from "@radix-ui/react-tabs";
import UsersManagement from "@/Page/Admin/Settings/SubPages/UsersManagement";
import Info from "@/Page/Admin/Settings/SubPages/Info";
import type { agentwpSettings } from "@/Types/types.d.ts";

declare const agentwp_settings: agentwpSettings;

export default function Settings() {

    const url = new URL(window.location.href);
    const initialTab = url.searchParams.get("tab") || "info";

    function handleTabChange(value: string) {
        url.searchParams.set("tab", value);
        window.history.pushState({}, "", url);
    }

    return (

        <div className="m-4">
            <div>
                <h1 className="text-2xl font-bold">AgentWP Settings</h1>
            </div>
            <Tabs.Root
                className="flex flex-col shadow-blackA2 mt-4"
                defaultValue={initialTab}
                onValueChange={value => handleTabChange(value)}
            >
                <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
                    <Tabs.Trigger
                        className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                        value="info"
                    >
                        Info
                    </Tabs.Trigger>
                    {agentwp_settings.agentwp_manager &&
                        <Tabs.Trigger
                            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                            value="connect"
                        >
                            Connect
                        </Tabs.Trigger>
                    }
                    {agentwp_settings.agentwp_users_manager &&
                        <Tabs.Trigger
                            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
                            value="users"
                        >
                            Users
                        </Tabs.Trigger>
                    }
                </Tabs.List>
                <Tabs.Content
                    className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                    value="info"
                >
                    <Info />
                </Tabs.Content>
                <Tabs.Content
                    className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                    value="connect"
                >
                    <ConnectToAwp />
                </Tabs.Content>
                <Tabs.Content
                    className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                    value="users"
                >
                    <UsersManagement />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
