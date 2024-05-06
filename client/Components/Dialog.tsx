import { useChat } from '@/Providers/ChatProvider';
import Message from '@/Components/Convo/Message';

export default function Dialog() {
  const { conversation } = useChat();
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 flex flex-col space-y-6 divide-y-2">
        {conversation.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}
      </div>
    </div>
  );
}
