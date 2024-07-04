import { useClient } from '@/Providers/ClientProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { usePage } from '@/Providers/PageProvider';

export default function ClearConversationButton( { children }: { children?: React.ReactNode } ) {
  const { clearConversation } = useClient();
  const { fetchConvo } = useUserRequests();
  const { page } = usePage();

  async function handleClearHistory() {
    if ( page.onboarding_completed && page.agentwp_access ) {
      await clearConversation();
      fetchConvo( null );
    }
  }

  return <button onClick={ handleClearHistory }>{ children }</button>;
}
