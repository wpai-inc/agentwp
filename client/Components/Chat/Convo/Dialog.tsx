import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';

export default function Dialog({
  conversation,
}: {
  conversation: UserRequestType[];
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {conversation.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  );
}
