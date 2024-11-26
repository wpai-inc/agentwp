import { WpUser } from '@/Types/types';
import { Button } from '@/Components/ui/button';
import { useTranslation } from 'react-i18next';

export default function ChatNoAccess( { user }: { user: WpUser } ) {
  const { t } = useTranslation();
  const name = user.display_name;

  return (
    <div className="mb-8 flex h-full flex-col items-center justify-center">
      <p className="text-3xl font-semibold text-black">
        { t( 'Hi' ) } { name },
      </p>
      <p className="text-center text-xl text-black">{ t( 'No Access' ) }</p>
      <Button className="mt-6 block w-full" variant="brand">
        { t( 'Request Access' ) }
      </Button>
    </div>
  );
}
