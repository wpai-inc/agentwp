/**
 * Docs for this component at https://recharts.org/en-US/api/LineChart
 */
import React from 'react';
import {
  Line as RootLine,
  CartesianGrid,
  Legend,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface LineProps {
  width?: number | string;
  height?: number | string;
  xDataKey?: string;
  valueDataKey: string;
  data: object[];
  strokeColor?: string;
}

const Line = ({
  width = 730,
  height = 250,
  xDataKey,
  valueDataKey,
  data,
  strokeColor = '#4991f7',
}: LineProps) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <RootLine dataKey={valueDataKey} stroke={strokeColor} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Line;
