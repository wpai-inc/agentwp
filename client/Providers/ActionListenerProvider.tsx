import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import useAwpClient from '@/Hooks/useAwpClient';
import { useUserRequests } from '@/Providers/UserRequestsProvider';

const ActionListenerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { streamClosed, startStreamFromRequest } = useStream();
  const { currentAction, setCurrentAction, currentUserRequestId } =
    useUserRequests();

  const client = useAwpClient();

  useEffect(() => {
    if (currentAction && streamClosed)
      if (!currentAction.hasExecuted) {
        /**
         * Executes the current action
         */
        switch (currentAction.action.ability) {
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
