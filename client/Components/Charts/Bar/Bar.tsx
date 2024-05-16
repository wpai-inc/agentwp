/**
 * Docs for this component at https://recharts.org/en-US/api/BarChart
 */

import {
  ResponsiveContainer,
  Bar as RootBar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface BarProps {
  width?: number | string;
  height?: number | string;
  xDataKey?: string;
  valueDataKey: string;
  data: object[];
  fillColor?: string;
}

const Bar = ({
  width = 730,
  height = 250,
  xDataKey,
  valueDataKey,
  data,
  fillColor = '#4991f7',
}: BarProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <RootBar dataKey={valueDataKey} fill={fillColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Bar;
