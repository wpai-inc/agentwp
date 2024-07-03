import { WpUser } from '@/Types/types';
import { Button } from '@/Components/ui/button';

export default function ChatNoAccess( { user }: { user: WpUser } ) {
  const name = user.display_name;

  const currentPage = window.location.href;
  const showButton = currentPage.indexOf( 'page=agent-wp-admin-settings' ) === -1;

  return (
    <div className="mb-8 flex h-full flex-col items-center justify-center">
      <p className="text-3xl font-semibold text-black">Hi { name },</p>
      <p className="text-center text-xl text-black">No Access</p>

      <Button className="mt-6 block w-full" variant="brand">
        Request Access
      </Button>
    </div>
  );
}
