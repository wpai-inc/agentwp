import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import useAwpClient from '@/Hooks/useAwpClient';

const ActionListenerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { liveAction } = useStream();
  const client = useAwpClient();

  useEffect(() => {
    if (liveAction && liveAction.ability === 'navigate') {
      client.storeAgentResult(liveAction.id, {
        status: 'success',
        data: liveAction.action,
      });
      window.location.href = liveAction.action.url;
    }
  }, [liveAction]);

  return <>{children}</>;
};

export default ActionListenerProvider;
