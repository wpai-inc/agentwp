import { WpUser } from '@/Types/types';
import { Button } from '@/Components/ui/button';
import { useTranslation } from 'react-i18next';

export default function ChatNotConnected( { user }: { user: WpUser } ) {
  const { t } = useTranslation();
  const name = user.display_name;

  const currentPage = window.location.href;
  const showButton = currentPage.indexOf( 'page=agentwp-admin-settings' ) === -1;

  return (
    <div className="mb-8 flex h-full flex-col items-center justify-center">
      <p className="text-3xl font-semibold text-black">Hi { name },</p>
      <p className="text-center text-xl text-black">
        { t(
          'To begin using AgentWP, connect it to the AI services. If this is your first time connecting this site, a quick indexing process will take place.',
        ) }
      </p>

      { showButton && (
        <Button className="mt-6 block w-full" variant="brand" asChild={ true }>
          <a
            className="flex items-center"
            href="/wp-admin/admin.php?page=agentwp-admin-settings&tab=connect">
            { t( 'Connect AI Services' ) }
          </a>
        </Button>
      ) }
    </div>
  );
}
