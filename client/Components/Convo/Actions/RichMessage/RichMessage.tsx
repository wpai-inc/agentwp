import Bar from '@/Components/Charts/Bar';
import Line from '@/Components/Charts/Line';
import Pie from '@/Components/Charts/Pie';
import NavigatableButton from '@/Components/NavigatableButton';
import ActionSimpleMessage from '@/Components/Convo/Actions/ActionSimpleMessage';
import { AgentAction } from '@/Providers/UserRequestsProvider';

const RichMessage = (props: AgentAction) => {
  const isGraph = !!props.action.graph;
  const areButtons = !!props.action.buttons;

  if (isGraph) {
    const graphType = props.action.graph.graphType;
    const data = props.action.graph.data;
    if (graphType === 'bar') {
      return (
        <div className="flex flex-col gap-4">
          <ActionSimpleMessage {...props} />
          <Bar
            data={data}
            valueDataKey="value"
            xDataKey="label"
            width={'100%'}
          />
        </div>
      );
    } else if (graphType === 'line') {
      return (
        <div className="flex flex-col gap-4">
          <ActionSimpleMessage {...props} />
          <Line
            data={data}
            valueDataKey="value"
            xDataKey="label"
            width={'100%'}
          />
        </div>
      );
    } else if (graphType === 'pie') {
      return (
        <div className="flex flex-col gap-4">
          <ActionSimpleMessage {...props} />
          <Pie
            data={data}
            valueDataKey="value"
            dataKey="label"
            width={'100%'}
          />
        </div>
      );
    }
  } else if (areButtons) {
    const buttons = props.action.buttons as any[];
    return (
      <>
        <ActionSimpleMessage {...props} />
        {buttons.length > 0
          ? buttons.map((b) => (
              <NavigatableButton text={b.label} link={b.url} className={''} />
            ))
          : null}
      </>
    );
  } else {
    return <ActionSimpleMessage {...props} />;
  }

  return (
    <div>
      <p>There was an error rendering this component</p>
    </div>
  );
};

export default RichMessage;
