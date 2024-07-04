import { WpUser } from '@/Types/types';
import { Button } from '@/Components/ui/button';

export default function ChatNoAccess( { user }: { user: WpUser } ) {
  const name = user.display_name;

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
