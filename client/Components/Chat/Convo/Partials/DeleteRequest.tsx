import { useChat } from '@/Providers/ChatProvider';
import { useClient } from '@/Providers/ClientProvider';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import { optimistic } from '@/lib/utils';

export default function DeleteRequest( { userRequest }: { userRequest: UserRequestType } ) {
  const { removeRequest } = useClient();
  const { removeUserRequest, addUserRequest } = useChat();

  function handleDelete() {
    optimistic(
      async () => removeRequest( userRequest.id ),
      () => removeUserRequest( userRequest ),
      () => addUserRequest( userRequest ),
    );
  }

  return (
    <button onClick={ handleDelete } className="px-2 py-1 bg-brand-gray-15 rounded">
      Delete
    </button>
  );
}
