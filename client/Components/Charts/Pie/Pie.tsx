/**
 * Docs for this component at https://recharts.org/en-US/api/PieChart
 */
import React from 'react';
import {
  Pie as RootPie,
  PieChart,
  ResponsiveContainer
} from 'recharts';

interface PieProps {
  width?: number | string;
  height?: number | string;
  outerRadius?: number;
  fillColor?: string;
  data: object[];
  dataKey: string;
  valueDataKey: string;
}

const Pie = ({
  width = 730,
  height = 250,
  outerRadius = 50,
  fillColor = '#8884d8',
  data
}: PieProps) => {
  return (
    <ResponsiveContainer>
      <PieChart width={width} height={height}>
        <RootPie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={outerRadius}
          fill={fillColor}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Pie;
