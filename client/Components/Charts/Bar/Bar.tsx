import { Bar, BarChart, XAxis, CartesianGrid } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart';

export default function Component( { data } ) {
  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={ chartConfig } className="h-[200px] w-full">
      <BarChart accessibilityLayer data={ chartData }>
        <CartesianGrid vertical={ false } />
        <XAxis
          dataKey="month"
          tickLine={ false }
          tickMargin={ 10 }
          axisLine={ false }
          tickFormatter={ value => value.slice( 0, 3 ) }
        />
        <ChartTooltip content={ <ChartTooltipContent /> } />
        <ChartLegend content={ <ChartLegendContent /> } />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={ 4 } />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={ 4 } />
      </BarChart>
    </ChartContainer>
  );
}

/**
 * Docs for this component at https://recharts.org/en-US/api/BarChart
 */

// import {
//   ResponsiveContainer,
//   Bar as RootBar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts';

// interface BarProps {
//   width?: number | string;
//   height?: number | string;
//   xDataKey?: string;
//   valueDataKey: string;
//   data: object[];
//   fillColor?: string;
// }

// const Bar = ( { width = 730, height = 250, data, fillColor = '#4991f7' }: BarProps ) => {
//   const xDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 0 ] : 'label';
//   const valueDataKey = data[ 0 ] ? Object.keys( data[ 0 ] )[ 1 ] : 'value';

//   return (
//     <ResponsiveContainer width={ width } height={ height }>
//       <BarChart data={ data }>
//         <CartesianGrid strokeDasharray="2 2" />
//         { /* TODO: causing error: chunk-5OZJXOSV.js?v=528fe26e:521 Warning: YAxis:
//         Support for defaultProps will be removed from function components in a
//         future major release. Use JavaScript default parameters instead.
//         https://github.com/recharts/recharts/issues/3615 */ }
//         <XAxis dataKey={ xDataKey } />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <RootBar dataKey={ valueDataKey } fill={ fillColor } />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default Bar;
