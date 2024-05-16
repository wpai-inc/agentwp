import { useStream } from '@/Providers/StreamProvider';
import ActionContainer from '../ActionContainer';
import { RefreshCw } from 'lucide-react';
import { AgentAction } from '@/Providers/UserRequestsProvider';

export default function ActionIncomplete({
  userRequestId,
}: AgentAction & { userRequestId: string }) {
  const { startStreamFromRequest } = useStream();

  function handleRetry() {
    console.log('handling retry');
    startStreamFromRequest(userRequestId);
  }

  return (
    <ActionContainer pending={false}>
      <div className="flex justify-between">
        <p>Something went wrong.</p>
        <button onClick={handleRetry}>
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </ActionContainer>
  );
}
