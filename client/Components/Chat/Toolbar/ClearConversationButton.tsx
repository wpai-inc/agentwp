import { useClient } from '@/Providers/ClientProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { Button } from '@/Components/ui/button';
import AddIcon from '@material-design-icons/svg/outlined/add.svg?react';

export default function ClearConversationButton() {
  const { clearConversation } = useClient();
  const { fetchConvo } = useUserRequests();

  async function handleClearHistory() {
    await clearConversation();
    fetchConvo();
  }

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={ handleClearHistory }>
      <AddIcon className="h-5 w-5 text-gray-900 hover:text-black" />
    </Button>
  );
}
