import Bar from '@/Components/Charts/Bar';
import Line from '@/Components/Charts/Line';
import Pie from '@/Components/Charts/Pie';
import NavigatableButton from '@/Components/Button';
import ActionSimpleMessage from "@/Components/Convo/Actions/ActionSimpleMessage";
import type { MessageAgentAction } from '@/Components/Convo/Actions/ActionMessage';

const RichMessage = (props: MessageAgentAction) => {
  
    const action = props.action.action;
    const isGraph = !!action.graph;
    const areButtons = !!action.buttons;

    if (isGraph) {
      const graphType = action.graph.graphType;
      const data = action.graph.data;
      if (graphType === 'bar') {
        return (
          <div className="flex flex-col gap-4">
            <ActionSimpleMessage action={action as MessageAgentAction} />
            <Bar data={data} valueDataKey="value" xDataKey="label" width={"100%"} />
          </div>
        );
      } else if (graphType === 'line') {
        return (
          <div className="flex flex-col gap-4">
            <ActionSimpleMessage action={action as MessageAgentAction} />
            <Line data={data} valueDataKey="value" xDataKey="label" width={"100%"} />
          </div>
        )
      } else if (graphType === 'pie') {
        return (
          <div className="flex flex-col gap-4">
            <ActionSimpleMessage action={action as MessageAgentAction} />
            <Pie data={data} valueDataKey="value" dataKey="label" width={"100%"} />
          </div>
        );
      }
    } else if (areButtons) {
      const buttons = action.buttons;
      return (
        <>
          <ActionSimpleMessage action={action as MessageAgentAction} />
          {buttons.map(b => (
            <NavigatableButton text={b.label} link={b.url} className={""} />
          ))}
        </>
      );
    } else {
      return <ActionSimpleMessage action={action as MessageAgentAction} />;
    }

  return (
    <div>
      <p>There was an error rendering this component</p>
    </div>
  );
};

export default RichMessage;
