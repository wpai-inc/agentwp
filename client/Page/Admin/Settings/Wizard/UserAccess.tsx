import { Logo } from "@/Components/Logo";
import { Button } from "@/Components/ui/button";
import UsersManagement from "@/Page/Admin/Settings/SubPages/UsersManagement";

export default function UserAccess({ onGoToAboutPage }: { onGoToAboutPage: () => void }) {
    return (
        <div className="max-w-[470px] mx-auto text-base mt-12">
            <Logo className="mx-auto" />
            <div className="text-4xl font-bold text-center mt-4">
                Choose Who Can Use AgentWP
            </div>
            <UsersManagement />
            <div className={"text-center mt-16"}>
                <Button variant="brand" className="px-20" onClick={() => onGoToAboutPage()}>Continue</Button>
            </div>
        </div>
    );
}
