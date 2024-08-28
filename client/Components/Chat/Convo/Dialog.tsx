import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { usePage } from '@/Providers/PageProvider';
import ContentContext from '@/Components/Chat/ContentContext/ContentContext';
import { useInputSelect } from '@/Providers/InputSelectProvider';

export default function Dialog( { conversation }: { conversation: UserRequestType[] } ) {
  const { errors } = useError();
  const { page } = usePage();
  const { selectedInput } = useInputSelect();

  return (
    <InnerContainer>
      { ! conversation.length ? (
        <ChatWelcome user={ page.user } />
      ) : (
        conversation.map( msg => <Message key={ msg.id } { ...msg } /> )
      ) }
      { !! errors.length && <ChatError errors={ errors } /> }
      { selectedInput && <ContentContext selectedInput={ selectedInput } /> }
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
