/**
 * Docs for this component at https://recharts.org/en-US/api/LineChart
 */
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
  data: object[];
  strokeColor?: string;
}

const Line = ( { width = 730, height = 250, data, strokeColor = '#4991f7' }: LineProps ) => {
  const xDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 0 ] : 'label';
  const valueDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 1 ] : 'value';

  return (
    <ResponsiveContainer width={ width } height={ height }>
      <LineChart data={ data }>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey={ xDataKey } />
        <YAxis />
        <Tooltip />
        <Legend />
        <RootLine dataKey={ valueDataKey } stroke={ strokeColor } />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Line;
