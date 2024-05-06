import ActionContainer from '../ActionContainer';
import { NavigateAction } from '@wpai/schemas';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

export type NavigateAgentAction = Omit<AgentAction, 'action'> & {
  action: NavigateAction;
};

export default function ActionNavigate(props: NavigateAgentAction) {
  return (
    <ActionContainer pending={!props.result}>
      <p>
        Navigated to <strong>{props.action.url}</strong>
      </p>
    </ActionContainer>
  );
}
