import ActionContainer from '../ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

export default function ActionQuery(props: AgentAction) {
  return (
    <ActionContainer pending={!props.result}>
      <p>
        Ran query <strong>{props.action.sql}</strong>
      </p>
    </ActionContainer>
  );
}
