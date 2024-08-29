import type { AgentAction } from '@/Providers/UserRequestsProvider';
import Visualization from '@/Components/Chat/Convo/Actions/Visualization';
import ActionSimpleMessage from '@/Components/Chat/Convo/Actions/ActionSimpleMessage';
import type { MessageAction } from '@wpai/schemas';
import Buttons from './RichMessage/Buttons';
import type { Chart } from '@wpai/schemas';
import ActionEscalation from './ActionEscalation';

export default function ActionMessage( props: AgentAction ) {
  const action = props.action as MessageAction;

  return (
    <div className="flex flex-col gap-4">
      <ActionSimpleMessage { ...props } />
      { action?.graph && (
        <Visualization
          visualization={ action.graph.visualization }
          data={ action.graph.data }
          chart={ action.graph?.chart as Chart }
        />
      ) }
      { action.buttons && action.buttons?.length > 0 && <Buttons buttons={ action.buttons } /> }
      { action?.escalation && <ActionEscalation { ...props } /> }
    </div>
  );
}
