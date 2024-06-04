import ChatContainer from '@/Components/Chat/ChatContainer';
import ChatTrigger from '@/Components/Chat/ChatTrigger';
import { useChat } from '@/Providers/ChatProvider';

export default function Chat() {
  const { open, expanding } = useChat();
  return (
    <>
      { ( open || expanding ) && <ChatContainer /> }
      <ChatTrigger open={ open } />
    </>
  );
}
