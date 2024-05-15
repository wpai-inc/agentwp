import { useEffect, useState } from "react";
import adminRequest from "@/lib/adminRequest";
import type { agentwpUser } from "@/Types/types";
import { Button } from "@/Components/ui/button";
import { User } from "@/Page/Admin/Settings/Partials/User";
import SearchUser from "@/Page/Admin/Settings/Partials/SearchUser";
import BrandIcon from "@/Components/BrandIcon";
import UsersManagement from "@/Page/Admin/Settings/SubPages/UsersManagement";

export default function UserAccess({ onGoToAboutPage }: { onGoToAboutPage: () => void }) {
    return (
            <div className="max-w-[470px] mx-auto text-base mt-12">
                <BrandIcon />
                <div className="text-4xl font-bold text-center ">
                    Choose Who Can Use AgentWP
                </div>
                <UsersManagement />
                <div className={"text-center mt-16"}>
                    <Button type="button" onClick={() => onGoToAboutPage()}>Continue</Button>
                </div>
            </div>
    );
}
