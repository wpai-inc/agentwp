import { Bar, BarChart, XAxis, CartesianGrid } from 'recharts';
import { Chart } from '@wpai/schemas';
import { makeChartConfig, getDataKeys } from '@/Components/Charts/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/Components/ui/chart';

export default function Component( {
  chart,
  data,
}: {
  chart: Chart;
  data: {
    [ key: string ]: number;
  }[];
} ) {
  const { xAxisKey, xAxisTickAbbr } = chart;
  const chartConfig = makeChartConfig( chart );
  const keys = getDataKeys( chart );

  return (
    <ChartContainer config={ chartConfig } className="h-[200px] w-full">
      <BarChart accessibilityLayer data={ data }>
        <CartesianGrid vertical={ false } />
        <XAxis
          dataKey={ xAxisKey }
          tickLine={ false }
          tickMargin={ 10 }
          axisLine={ false }
          tickFormatter={ value => value.slice( 0, xAxisTickAbbr ) }
        />
        <ChartTooltip content={ <ChartTooltipContent /> } />
        <ChartLegend content={ <ChartLegendContent /> } />
        { keys.map( key => (
          <Bar key={ key } dataKey={ key } fill={ `var(--color-${ key })` } radius={ 4 } />
        ) ) }
      </BarChart>
    </ChartContainer>
  );
}
