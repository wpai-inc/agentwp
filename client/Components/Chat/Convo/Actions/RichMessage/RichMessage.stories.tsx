import RichMessage from './RichMessage';
import { AgentAction } from '@/Providers/UserRequestsProvider';

export default {
  title: 'Wpai/RichMessage',
  component: RichMessage,
};

export const BarGraphMessage = {
  args: {
    action: {
      ability: 'message',
      text: 'A Bar Graph',
      graph: {
        visualization: 'bar-chart',
        data: [
          { label: '2020', value: 1000 },
          { label: '2021', value: 1500 },
          { label: '2022', value: 3000 },
          { label: '2023', value: 4000 },
        ],
      },
    },
  } as AgentAction,
};

export const LineGraphMessage = {
  args: {
    action: {
      ability: 'message',
      text: 'A Bar Graph',
      graph: {
        visualization: 'line-chart',
        data: [
          { label: '2020', value: 1000 },
          { label: '2021', value: 1500 },
          { label: '2022', value: 3000 },
          { label: '2023', value: 4000 },
        ],
      },
    },
  } as AgentAction,
};

export const PieGraphMessage = {
  args: {
    action: {
      ability: 'message',
      text: 'A Bar Graph',
      graph: {
        visualization: 'donut-chart',
        data: [
          { label: '2020', value: 1000 },
          { label: '2021', value: 1500 },
          { label: '2022', value: 3000 },
          { label: '2023', value: 4000 },
        ],
      },
    },
  } as AgentAction,
};
