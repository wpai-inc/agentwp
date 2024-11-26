import { useChat } from '@/Providers/ChatProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import { optimistic } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function DeleteRequest( { userRequest }: { userRequest: UserRequestType } ) {
  const { proxyApiRequest } = useRestRequest();
  const { removeUserRequest, reloadConversation } = useChat();
  const { t } = useTranslation();

  function handleDelete() {
    optimistic(
      async () =>
        await proxyApiRequest( 'requestRemove', {
          userRequest: userRequest.id,
        } ),
      () => removeUserRequest( userRequest ),
      reloadConversation,
    );
  }

  return (
    <button onClick={ handleDelete } className="px-2 py-1 bg-brand-gray-15 rounded">
      { t( 'Delete' ) }
    </button>
  );
}
