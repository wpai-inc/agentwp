import Pie from './Pie';
import { PieProps } from 'recharts';

export default {
  title: 'Wpai/Charts/Pie',
  component: Pie as React.ComponentType< PieProps >,
};

export const Simple = {
  args: {
    outerRadius: 80,
    data: [
      { label: 'Agriculture', gdp: 150 },
      { label: 'Energy', gdp: 170 },
      { label: 'Finance', gdp: 200 },
      { label: 'Manufacturing', gdp: 300 },
    ],
  },
};
