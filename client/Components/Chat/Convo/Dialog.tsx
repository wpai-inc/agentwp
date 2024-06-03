import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { cn } from '@/lib/utils';
import LoadingScreen from '@/Components/Chat/LoadingScreen';

export default function Dialog( {
  conversation,
  pending,
}: {
  conversation: UserRequestType[];
  pending: boolean;
} ) {
  const { errors } = useError();
  return (
    <div
      className={ cn(
        'flex-1 flex flex-col-reverse overflow-y-auto p-4 relative max-w-screen-md mx-auto',
      ) }>
      { pending ? (
        <LoadingScreen />
      ) : (
        <>
          { ! conversation.length && <ChatWelcome /> }
          { conversation.map( msg => (
            <Message key={ msg.id } { ...msg } />
          ) ) }
        </>
      ) }

      { !! errors.length && <ChatError errors={ errors } /> }
    </div>
  );
}
