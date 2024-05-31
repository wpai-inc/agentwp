import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { cn } from '@/lib/utils';

export default function Dialog({
  conversation,
}: {
  conversation: UserRequestType[];
}) {
  const { errors } = useError();
  return (
    <div className="flex flex-1 justify-center overflow-y-auto">
      <div className={cn(
        'flex-1 flex flex-col-reverse overflow-y-auto p-4 relative',
        'items-center max-w-[800px]'
      )}>
        {!conversation.length && (
          <ChatWelcome />
        )}
        {conversation.map((msg) => (
          <Message key={msg.id} {...msg} />
        ))}
        {!!errors.length && <ChatError errors={errors} />}
      </div>
    </div>
  );
}
