import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useAdminRoute } from './AdminRouteProvider';
import { AxiosResponse } from 'axios';

const ActionListenerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { streamClosed, startStreamFromRequest } = useStream();
  const { currentAction, setCurrentAction, currentUserRequestId } =
    useUserRequests();
  const adminRequest = useAdminRoute();
  const client = useClient();

  useEffect(() => {
    if (currentAction && streamClosed && currentAction.action)
      if (!currentAction.hasExecuted) {
        /**
         * Executes the current action
         */
        switch (currentAction.action.ability) {
          case 'query':
            adminRequest
              .get('run_action_query', {
                params: {
                  sql: currentAction.action.sql,
                  params: currentAction.action.params,
                },
              })
              .then((response: AxiosResponse) => {
                client.storeAgentResult(currentAction.id, {
                  status: 'success',
                  data: response.data.results,
                });
              });
            break;
          case 'navigate':
            client.storeAgentResult(currentAction.id, {
              status: 'success',
            });
            window.location.href = currentAction.action.url;
            break;
          case 'message':
            client.storeAgentResult(currentAction.id, {
              status: 'success',
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
