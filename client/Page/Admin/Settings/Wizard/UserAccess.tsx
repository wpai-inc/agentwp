import { useEffect, useState } from "react";
import adminRequest from "@/lib/adminRequest";
import type { agentwpUser } from "@/Types/types";
import { Button } from "@/Components/ui/button";
import { User } from "@/Page/Admin/Settings/Partials/User";
import SearchUser from "@/Page/Admin/Settings/Partials/SearchUser";
import BrandIcon from "@/Components/BrandIcon";

export default function UserAccess({ onGoToAboutPage }: { onGoToAboutPage: () => void }) {


    const [users, setUsers] = useState<agentwpUser[]>([]);
    const [searching, setSearching] = useState(false);

    function getUsers() {
        setSearching(true);
        adminRequest.get("agentwp_users").then((response) => {
            setUsers(response.data);
            setSearching(false);
        });
    }

    useEffect(() => {
        getUsers();
    }, []);

    function searchUsers(value: string) {
        setSearching(true);
        adminRequest.get("agentwp_users", {
            params: {
                search: value
            }
        }).then((response) => {
            setUsers(response.data);
            setSearching(false);
        });
    }

    return (
            <div className="max-w-[470px] mx-auto text-base mt-12">
                <BrandIcon />
                <div className="text-4xl font-bold text-center ">
                    Choose Who Can Use AgentWP
                </div>
                <SearchUser searchUsers={searchUsers} searching={searching} />
                <div>
                    {users.map(user => (
                        <User user={user} key={user.id} />
                    ))}
                </div>
                <div className={"text-center mt-16"}>
                    <Button type="button" onClick={() => onGoToAboutPage()}>Continue</Button>
                </div>
            </div>
    );
}
