import React from 'react';
import PropTypes from 'prop-types';
import {
  Bar as RootBar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface BarProps {
  width: number;
  height: number;
  data: object[];
}

const Bar = (props: BarProps) => {
  return (
    <BarChart>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <RootBar dataKey="pv" fill="#8884d8" />
      <RootBar dataKey="uv" fill="#82ca9d" />
    </BarChart>
  );
};

Bar.propTypes = {
  width: PropTypes.number,
  hiehgt: PropTypes.number,
  data: PropTypes.arrayOf(Object),
};

const sampleData = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300
  }
];

Bar.defaultProps = {
  width: 750,
  height: 250,
  data: sampleData
};

export default Bar;
