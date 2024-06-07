import { useClient } from '@/Providers/ClientProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
export default function ClearConversationButton( { children }: { children?: React.ReactNode } ) {
  const { clearConversation } = useClient();
  const { fetchConvo } = useUserRequests();

  async function handleClearHistory() {
    await clearConversation();
    fetchConvo( null );
  }

  return <button onClick={ handleClearHistory }>{ children }</button>;
}
