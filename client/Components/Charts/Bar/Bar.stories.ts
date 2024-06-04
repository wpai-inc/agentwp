import Bar from './Bar';
import { BarProps } from 'recharts';

export default {
  title: 'Wpai/Charts/Bar',
  component: Bar as React.ComponentType< BarProps >,
};

export const Simple = {
  args: {
    data: [
      { label: 'Honduras', developers: 40 },
      { label: 'Romania', developers: 80 },
      { label: 'Brasil', developers: 20 },
      { label: 'United States', developers: 40 },
    ],
  },
};
