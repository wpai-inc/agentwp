import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

export default function ActionNavigate( { hasExecuted, action }: AgentAction ) {
  return (
    <ActionContainer pending={ ! hasExecuted }>
      <p>
        Navigated to <strong>{ action.url as string }</strong>
      </p>
    </ActionContainer>
  );
}
