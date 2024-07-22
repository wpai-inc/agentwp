import { Button } from '@/Components/ui/button';
import { useClient } from '@/Providers/ClientProvider';

export default function Info() {
  const { client } = useClient();
  function refreshToken() {
    client.refreshToken();
  }

  return (
    <>
      <div className="flex gap-4 justify-end">
        <Button variant="brand-gray" className="" asChild={true}>
          <a href="#">Plugin Settings</a>
        </Button>
        <Button variant="brand-gray" className="" asChild={true}>
          <a href="#">Manage Account</a>
        </Button>
      </div>
      <div className={'flex justify-between'}>
        <div className={'w-[720px]'}>
          <div className={'text-4xl font-bold'}>Welcome To AgentWP</div>
          <div className={'text-lg mt-4'}>
            To get started, watch this quick video demo of how AgentWP works.
          </div>

          <iframe
            className={'mt-4'}
            width="720"
            height="402"
            src="https://www.youtube.com/embed/_CL6n0FJZpk?si=LnpM6okLLqIXyb-7"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen></iframe>

          <div className="flex gap-4 justify-between mt-4">
            <Button variant="brand" className="w-full" asChild={true}>
              <a href="#">Upgrade To Pro</a>
            </Button>
            <Button variant="brand-outline" className="w-full" asChild={true}>
              <a href="#">To Admin Dashboard</a>
            </Button>
            <Button variant="brand-outline" className="w-full" asChild={true}>
              <a href="#">To Homepage</a>
            </Button>
          </div>
        </div>
        <img
          src="/wp-content/plugins/agentwp/assets/images/howto.jpg"
          className={'max-h-[700px]'}
          alt=""
        />
      </div>
    </>
  );
}
