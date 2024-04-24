import { useChat } from '@/Providers/ChatProvider';
import Message from '@/Components/Convo/Message';

export default function Dialog() {
  const { conversation } = useChat();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 text-white flex flex-col justify-end">
        {conversation.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}
      </div>
    </div>
  );
}
