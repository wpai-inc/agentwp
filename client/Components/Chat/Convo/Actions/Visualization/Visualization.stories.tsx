import { Chart } from '@wpai/schemas';
import ActionMessage from '@/Components/Chat/Convo/Actions/ActionMessage';
import { AgentAction } from '@/Providers/UserRequestsProvider';
import type { DataProps } from './Visualization';

export default {
  title: 'Wpai/RichMessage',
  component: ActionMessage,
};

const chart: Chart = {
  xAxisKey: 'month',
  dataKeys: [
    {
      key: 'desktop',
      label: 'Desktop Users',
      color: '#4991F7',
    },
    {
      key: 'mobile',
      label: 'Mobile Users',
      color: '#FF70A6',
    },
  ],
  xAxisTickAbbr: 3,
};

const data: DataProps = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

export const BarGraphMessage = {
  args: {
    id: '1',
    created_at: '2021-09-29T14:00:00.000Z',
    human_created_at: 'just now',
    final: true,
    recipe_idx: 0,
    result: [],
    hasExecuted: true,
    action: {
      id: '1a',
      ability: 'message',
      text: 'A Bar Graph',
      graph: {
        visualization: 'bar-chart',
        chart: chart,
        data: data,
      },
    },
  } as AgentAction,
};

export const LineGraphMessage = {
  args: {
    id: '1',
    created_at: '2021-09-29T14:00:00.000Z',
    human_created_at: 'just now',
    final: true,
    recipe_idx: 0,
    result: [],
    hasExecuted: true,
    action: {
      ability: 'message',
      text: 'A Bar Graph',
      graph: {
        visualization: 'line-chart',
        chart: chart,
        data: data,
      },
    },
  } as AgentAction,
};

export const PieGraphMessage = {
  args: {
    id: '1',
    created_at: '2021-09-29T14:00:00.000Z',
    human_created_at: 'just now',
    final: true,
    recipe_idx: 0,
    result: [],
    hasExecuted: true,
    action: {
      ability: 'message',
      text: 'A Bar Graph',
      graph: {
        visualization: 'donut-chart',
        chart: chart,
        data: data,
      },
    },
  } as AgentAction,
};

export const BigNumberCardMessage = {
  args: {
    id: '1',
    created_at: '2021-09-29T14:00:00.000Z',
    human_created_at: 'just now',
    final: true,
    recipe_idx: 0,
    result: [],
    hasExecuted: true,
    action: {
      ability: 'message',
      text: 'lorem ipsum dolor sit amet',
      graph: {
        visualization: 'big-number-card',
        chart: chart,
        data: data,
      },
    },
  } as AgentAction,
};
