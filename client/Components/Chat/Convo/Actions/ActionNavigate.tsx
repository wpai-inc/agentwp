import ActionContainer from '../ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

export default function ActionNavigate(props: AgentAction) {
  return (
    <ActionContainer pending={!props.result}>
      <p>
        Navigated to <strong>{props.action.url}</strong>
      </p>
    </ActionContainer>
  );
}
