import { Button } from "@/Components/ui/button";

export default function AboutThePlugin() {
    return (
        <div className={'flex justify-between'}>
            <div className={"w-[720px]"}>
                <div className={"text-4xl font-bold"}>Welcome To AgentWP</div>
                <div className={"text-lg mt-4"}>To get started, watch this quick video demo of how AgentWP works.</div>

                <iframe className={"mt-4"} width="720" height="402" src="https://www.youtube.com/embed/_CL6n0FJZpk?si=LnpM6okLLqIXyb-7" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen></iframe>

                <div className={"flex justify-between mt-4"}>
                    <Button>Upgrade To Pro</Button>
                    <Button>To Admin Dashboard</Button>
                    <Button>To Homepage</Button>
                </div>
            </div>
            <img src="/wp-content/plugins/agent-wp/assets/images/howto.jpg" className={'max-h-[700px]'} alt="" />
        </div>
    );
}
