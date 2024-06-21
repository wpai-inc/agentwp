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

const Bar = ( { width = 730, height = 250, data, fillColor = '#4991f7' }: BarProps ) => {
  const xDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 0 ] : 'label';
  const valueDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 1 ] : 'value';

  return (
    <ResponsiveContainer width={ width } height={ height }>
      <BarChart data={ data }>
        <CartesianGrid strokeDasharray="2 2" />
        { /* TODO: causing error: chunk-5OZJXOSV.js?v=528fe26e:521 Warning: YAxis:
        Support for defaultProps will be removed from function components in a
        future major release. Use JavaScript default parameters instead.
        https://github.com/recharts/recharts/issues/3615 */ }
        <XAxis dataKey={ xDataKey } />
        <YAxis />
        <Tooltip />
        <Legend />
        <RootBar dataKey={ valueDataKey } fill={ fillColor } />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Bar;
