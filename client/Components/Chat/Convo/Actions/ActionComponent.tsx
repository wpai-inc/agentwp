import type { AgentAction } from '@/Providers/UserRequestsProvider';
import { Abilities } from '@wpai/schemas';
import ActionNavigate from '@/Components/Chat/Convo/Actions/ActionNavigate';
import ActionMessage from '@/Components/Chat/Convo/Actions/ActionMessage';
import ActionQuery from '@/Components/Chat/Convo/Actions/ActionQuery';

type ActionComponentsType = {
  [key in Abilities]?: React.ComponentType<AgentAction>;
};

const ActionComponents: ActionComponentsType = {
  message: ActionMessage,
  navigate: ActionNavigate,
  query: ActionQuery,
};

export default function ActionComponent(props: AgentAction) {
  const ability: Abilities = props.action.ability;
  const DynamicComponent = ActionComponents[ability];
  if (!DynamicComponent) {
    console.error(`No component found for ability: ${ability}`);

    return null;
  }

  return <DynamicComponent {...props} />;
}
