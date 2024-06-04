/**
 * Docs for this component at https://recharts.org/en-US/api/PieChart
 */
import { Pie as RootPie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieProps {
  width?: number | string;
  height?: number | string;
  outerRadius?: number;
  fillColor?: string;
  data: object[];
  dataKey: string;
  valueDataKey: string;
}

const Pie = ( {
  width = 730,
  height = 250,
  outerRadius = 50,
  fillColor = '#4991f7',
  data,
}: PieProps ) => {
  const dataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 0 ] : 'label';
  const valueDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 1 ] : 'value';

  return (
    <ResponsiveContainer width={ width } height={ height }>
      <PieChart>
        <Tooltip />
        <RootPie
          data={ data }
          dataKey={ valueDataKey }
          nameKey={ dataKey }
          cx="50%"
          cy="50%"
          outerRadius={ outerRadius }
          fill={ fillColor }
          label
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Pie;
