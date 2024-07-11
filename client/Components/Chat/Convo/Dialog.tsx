import Message from '@/Components/Chat/Convo/Message/Message';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import ChatWelcome from '@/Components/ChatWelcome';
import { useError } from '@/Providers/ErrorProvider';
import { ChatError } from '@/Components/Chat/Alerts/Error';
import { cn } from '@/lib/utils';
import { usePage } from '@/Providers/PageProvider';
import ContentContext from '@/Components/Chat/ContentContext/ContentContext';
import { useInputSelect } from '@/Providers/InputSelectProvider';

export default function Dialog( { conversation }: { conversation: UserRequestType[] } ) {
  const { errors } = useError();
  const { page } = usePage();
  const { selectedInput } = useInputSelect();

  function hasSelectedInput(): boolean {
    if ( selectedInput?.data?.inputPath?.startsWith( 'div#awp-chat' ) ) return false;

    return selectedInput !== null;
  }

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
      { hasSelectedInput() && <ContentContext selectedInput={ selectedInput } /> }
    </div>
  );
}
