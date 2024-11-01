import type { AgentAction } from '@/Providers/UserRequestsProvider';
import { Abilities } from '@wpai/schemas';
import ActionNavigate from '@/Components/Chat/Convo/Actions/ActionNavigate';
import ActionMessage from '@/Components/Chat/Convo/Actions/ActionMessage';
import ActionQuery from '@/Components/Chat/Convo/Actions/ActionQuery';
import ActionWriteToEditor from './ActionWriteToEditor';
import ActionWriteToInputField from '@/Components/Chat/Convo/Actions/ActionWriteToInputField';
import ActionNavigationConfirmation from './ActionNavigationConfirmation';

type ActionComponentsType = {
  [ key in Abilities ]?: React.ComponentType< AgentAction >;
} & {
  navigation_confirmation?: React.ComponentType< AgentAction >;
};

const ActionComponents: ActionComponentsType = {
  message: ActionMessage,
  navigate: ActionNavigate,
  query: ActionQuery,
  write_to_editor: ActionWriteToEditor,
  write_to_input: ActionWriteToInputField,
  navigation_confirmation: ActionNavigationConfirmation,
};

export default function ActionComponent( props: AgentAction ) {
  const ability: Abilities = props.action.ability as Abilities;
  const DynamicComponent = ActionComponents[ ability ];

  if ( ! DynamicComponent ) {
    console.error( `No component found for ability: ${ ability }` );

    return null;
  }

  return <DynamicComponent { ...props } />;
}
