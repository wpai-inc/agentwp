import { EscalationProvider } from '@/Providers/EscalationProvider';
import CodeableEscalation from '@/Components/Chat/Convo/Actions/Escalations/CodeableEscalation';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import ActionSimpleMessage from './ActionSimpleMessage';
import type { MessageActionEscalation } from '@wpai/schemas';

const EscalationComponent = {
  codeable: CodeableEscalation,
};

export default function ActionEscalation( props: AgentAction ) {
  const escalation = props.action.escalation as MessageActionEscalation;
  const Component = escalation?.service ? EscalationComponent[ escalation?.service ] : null;
  return (
    <EscalationProvider escalation={ escalation }>
      { Component && <Component escalation={ escalation } /> }
    </EscalationProvider>
  );
}
