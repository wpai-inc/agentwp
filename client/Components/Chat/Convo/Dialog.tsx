import Message from '@/Components/Chat/Convo/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';

export default function Dialog({
  conversation,
}: {
  conversation: UserRequestType[];
}) {
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
