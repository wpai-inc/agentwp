import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';

export default function Dialog({
  conversation,
}: {
  conversation: UserRequestType[];
}) {
  return (
    <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4">
      {!conversation.length && (
        <ChatWelcome />
      )}
      {conversation.map((msg) => (
        <Message key={msg.id} {...msg} />
      ))}
    </div>
  );
}
