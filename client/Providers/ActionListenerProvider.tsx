import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';

const ActionListenerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { liveAction } = useStream();

  useEffect(() => {
    if (liveAction && liveAction.ability === 'navigate') {
      window.location.href = liveAction.action.url;
    }
  }, [liveAction]);

  return <>{children}</>;
};

export default ActionListenerProvider;
