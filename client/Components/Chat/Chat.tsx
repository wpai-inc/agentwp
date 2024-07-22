import ChatContainer from '@/Components/Chat/ChatContainer';
import ChatTrigger from '@/Components/Chat/ChatTrigger';
import { useChat } from '@/Providers/ChatProvider';
import { usePage } from '@/Providers/PageProvider';

export default function Chat() {
  const { open } = useChat();
  const { canAccessAgent } = usePage();

  return (
    <>
      { canAccessAgent && (
        <>
          { ( open ) && <ChatContainer /> }
          <ChatTrigger open={ open } />
        </>
      ) }
    </>
  );
}
