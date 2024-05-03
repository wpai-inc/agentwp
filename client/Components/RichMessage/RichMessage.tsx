import React from 'react';
import { BaseAction, MessageAction, NavigateAction } from "@wpai/schemas";
import ActionMessage from "@/Components/Convo/Actions/ActionMessage";
import Bar from '@/Components/Charts/Bar';
import Line from '@/Components/Charts/Line';
import Pie from '@/Components/Charts/Pie';
import NavigatableButton from '@/Components/Button';
import ActionNavigate from '@/Components/Convo/Actions/ActionNavigate';

interface RichMessageProps {
  action: BaseAction;
}

const RichMessage = ({
  action,
}: RichMessageProps) => {
  if (action.ability === 'message') {
    const isGrpah = !!action.graph;
    const areButtons = !!action.buttons;

    if (isGrpah) {
      const graphType = action.graph.graphType;
      const data = action.graph.data;
      if (graphType === 'bar') {
        return (
          <div className="flex flex-col gap-4">
            <ActionMessage action={action as MessageAction} />
            <Bar data={data} valueDataKey="value" xDataKey="label" width={"100%"} />
          </div>
        );
      } else if (graphType === 'line') {
        return (
          <div className="flex flex-col gap-4">
            <ActionMessage action={action as MessageAction} />
            <Line data={data} valueDataKey="value" xDataKey="label" width={"100%"} />
          </div>
        )
      } else if (graphType === 'pie') {
        return (
          <div className="flex flex-col gap-4">
            <ActionMessage action={action as MessageAction} />
            <Pie data={data} valueDataKey="value" dataKey="label" width={"100%"} />
          </div>
        );
      }
    } else if (areButtons) {
      const buttons = action.buttons;
      return (
        <>
          <ActionMessage action={action as MessageAction} />
          {buttons.map(b => (
            <NavigatableButton text={b.label} link={b.url} className={""} />
          ))}
        </>
      );
    } else {
      return (
        <>
          <ActionMessage action={action as MessageAction} />
        </>
      );
    }
  } else if (action.ability === 'navigate') {
    return <ActionNavigate action={action as NavigateAction} />;
  } else if (action.ability === 'code') {

  } else if (action.ability === 'run') {

  }

  return (
    <div>
      <p>There was an error rendering this component</p>
    </div>
  );
};

export default RichMessage;
