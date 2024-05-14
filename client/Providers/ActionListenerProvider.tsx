import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useAdminRoute } from './AdminRouteProvider';

const ActionListenerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { streamClosed, startStreamFromRequest } = useStream();
  const { currentAction, setCurrentAction, currentUserRequestId } =
    useUserRequests();
  const adminRequest = useAdminRoute();
  const client = useClient();

  useEffect(() => {
    adminRequest.get('test_route').then((response) => {
      console.log('test_route', response.data);
    });
  }, []);

  useEffect(() => {
    if (currentAction && streamClosed && currentAction.action)
      if (!currentAction.hasExecuted) {
        /**
         * Executes the current action
         */
        switch (currentAction.action.ability) {
          case 'query':
            client.storeAgentResult(currentAction.id, {
              status: 'success',
              data: currentAction.action,
            });
            // window.location.href = currentAction.action.url;
            break;
          case 'navigate':
            client.storeAgentResult(currentAction.id, {
              status: 'success',
              data: currentAction.action,
            });
            window.location.href = currentAction.action.url;
            break;
          case 'message':
            client.storeAgentResult(currentAction.id, {
              status: 'success',
              data: currentAction.action,
            });
            break;
        }

        currentAction.hasExecuted = true;
        setCurrentAction(currentAction);
      } else {
        /**
         * Restarts stream if the current action is not final
         */
        if (currentUserRequestId && !currentAction.final) {
          startStreamFromRequest(currentUserRequestId);
        }
      }
  }, [currentAction, streamClosed, currentUserRequestId]);

  return <>{children}</>;
};

export default ActionListenerProvider;
