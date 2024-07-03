import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { cn } from '@/lib/utils';
import { usePage } from '@/Providers/PageProvider';
import ChatNotConnected from '@/Components/ChatNotConnected';
import ChatNoAccess from '@/Components/ChatNoAccess';

export default function Dialog( { conversation }: { conversation: UserRequestType[] } ) {
  const { errors } = useError();
  const { user } = usePage().page;
  const { page } = usePage();

  console.log( 'page', page );

  return (
    <div
      className={ cn(
        'flex-1 flex flex-col-reverse overflow-y-auto p-4 relative max-w-screen-md mx-auto w-full',
      ) }>
      { ! conversation.length ? (
        <>
          { ! page.onboarding_completed && <ChatNotConnected user={ user } /> }
          { page.onboarding_completed && ! page.agentwp_access && <ChatNoAccess user={ user } /> }
          { page.onboarding_completed && page.agentwp_access && (
            <ChatWelcome user={ user } />
          ) }{ ' ' }
        </>
      ) : (
        conversation.map( msg => <Message key={ msg.id } { ...msg } /> )
      ) }
      { !! errors.length && <ChatError errors={ errors } /> }
    </div>
  );
}
