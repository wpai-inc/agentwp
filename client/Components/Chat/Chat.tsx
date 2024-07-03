import ChatContainer from '@/Components/Chat/ChatContainer';
import ChatTrigger from '@/Components/Chat/ChatTrigger';
import { useChat } from '@/Providers/ChatProvider';
import { usePage } from '@/Providers/PageProvider';

export default function Chat() {
  const { open, expanding } = useChat();
  const { page } = usePage();

  return (
    <>
      { page.onboarding_completed && page.agentwp_access && (
        <>
          { ( open || expanding ) && <ChatContainer /> }
          <ChatTrigger open={ open } />
        </>
      ) }
    </>
  );
}
