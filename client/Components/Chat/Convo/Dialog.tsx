import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { usePage } from '@/Providers/PageProvider';

export default function Dialog( { conversation }: { conversation: UserRequestType[] } ) {
  const { page } = usePage();

  return (
    <InnerContainer>
      { ! conversation.length ? (
        <ChatWelcome user={ page.user } />
      ) : (
        conversation.map( msg => <Message key={ msg.id } { ...msg } /> )
      ) }
    </InnerContainer>
  );
}

function InnerContainer( { children }: { children: React.ReactNode } ) {
  return (
    <div className="relative mx-auto flex w-full max-w-screen-md flex-1 flex-col-reverse overflow-y-auto p-4">
      { children }
    </div>
  );
}
