import Line from './Line';
import { LineProps } from 'recharts';

export default {
  title: 'Wpai/Charts/Line',
  component: Line as React.ComponentType< LineProps >,
};

export const Simple = {
  args: {
    data: [
      { label: '1981-1990', value: 100 },
      { label: '1991-2000', value: 170 },
      { label: '2001-2010', value: 200 },
      { label: '2011-2020', value: 300 },
    ],
  },
};
