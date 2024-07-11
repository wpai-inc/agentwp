import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { cn } from '@/lib/utils';
import { usePage } from '@/Providers/PageProvider';
import { ChatNotice } from '../Alerts/Notice';

export default function Dialog( { conversation }: { conversation: UserRequestType[] } ) {
  const { errors } = useError();
  const { page } = usePage();

  return (
    <div
      className={ cn(
        'flex-1 flex flex-col-reverse overflow-y-auto p-4 relative max-w-screen-md mx-auto w-full',
      ) }>
      { ! conversation.length ? (
        <>
          <ChatWelcome user={ page.user } />{ ' ' }
        </>
      ) : (
        conversation.map( msg => <Message key={ msg.id } { ...msg } /> )
      ) }
      { !! errors.length && <ChatError errors={ errors } /> }
      <ChatNotice message="sample notice" />
    </div>
  );
}
