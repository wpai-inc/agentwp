import Line from './Line';
import { LineProps } from 'recharts';

export default {
  title: 'Wpai/Charts/Line',
  component: Line as React.ComponentType< LineProps >,
};

export const Simple = {
  args: {
    data: [
      { month: 'January', desktop: 186, mobile: 80 },
      { month: 'February', desktop: 305, mobile: 200 },
      { month: 'March', desktop: 237, mobile: 120 },
      { month: 'April', desktop: 73, mobile: 190 },
      { month: 'May', desktop: 209, mobile: 130 },
      { month: 'June', desktop: 214, mobile: 140 },
    ],
    chart: {
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
    },
  },
};
