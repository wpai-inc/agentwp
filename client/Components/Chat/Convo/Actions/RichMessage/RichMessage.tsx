import Bar from '@/Components/Charts/Bar';
import Line from '@/Components/Charts/Line';
import Pie from '@/Components/Charts/Pie';
import NavigatableButton from '@/Components/NavigatableButton';
import ActionSimpleMessage from '@/Components/Chat/Convo/Actions/ActionSimpleMessage';
import { AgentAction } from '@/Providers/UserRequestsProvider';
import { EscalationProvider } from '@/Providers/EscalationProvider';
import CodeableEscalation from '@/Components/Chat/Convo/Actions/Escalations/CodeableEscalation';

export default function RichMessage( props: AgentAction ) {
  if ( props.action.ability === 'message' ) {
    const isGraph = !! props.action.graph;
    const isEscalation = !! props.action.escalation;
    const areButtons = !! props.action.buttons;

    const action = props.action;
    if ( isGraph ) {
      const graphType = action.graph?.graphType;
      const data = action.graph?.data;
      if ( graphType === 'bar' ) {
        return (
          <GraphContainer>
            <ActionSimpleMessage { ...props } />
            <Bar data={ data ?? [] } valueDataKey="value" xDataKey="label" width={ '100%' } />
          </GraphContainer>
        );
      } else if ( graphType === 'line' ) {
        return (
          <GraphContainer>
            <ActionSimpleMessage { ...props } />
            <Line data={ data ?? [] } width={ '100%' } />
          </GraphContainer>
        );
      } else if ( graphType === 'pie' ) {
        return (
          <GraphContainer>
            <ActionSimpleMessage { ...props } />
            <Pie data={ data ?? [] } valueDataKey="value" dataKey="label" width={ '100%' } />
          </GraphContainer>
        );
      }
    } else if ( isEscalation ) {
      const escalation = action.escalation!;
      const service = escalation.service;
      return (
        <EscalationProvider escalation={ escalation }>
          <ActionSimpleMessage { ...props } />
          { service === 'codeable' && <CodeableEscalation escalation={ escalation } /> }
        </EscalationProvider>
      );
    } else if ( areButtons ) {
      const buttons = action.buttons as any[];
      return (
        <>
          <ActionSimpleMessage { ...props } />
          { buttons.length > 0 ? (
            <div className="flex gap-2 items-center mt-2">
              { buttons.map( b => (
                <NavigatableButton text={ b.label } link={ b.url } styleType={ b.level } />
              ) ) }
            </div>
          ) : null }
        </>
      );
    } else {
      return <ActionSimpleMessage { ...props } />;
    }
  }

  return (
    <div>
      <p>There was an error rendering this component</p>
    </div>
  );
}

function GraphContainer( { children }: { children: React.ReactNode } ) {
  return <div className="flex flex-col pt-4 gap-4">{ children }</div>;
}
