import { Chart } from '@wpai/schemas';
import { makeChartConfig, getDataKeys } from '@/Components/Charts/utils';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartLegend,
  ChartLegendContent,
  ChartContainer,
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
      <AreaChart
        accessibilityLayer
        data={ data }
        margin={ {
          left: 12,
          right: 12,
        } }>
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
          <Area
            type="natural"
            key={ key }
            dataKey={ key }
            fill={ `var(--color-${ key })` }
            fillOpacity={ 0.4 }
            stroke={ `var(--color-${ key })` }
            stackId="a"
          />
        ) ) }
      </AreaChart>
    </ChartContainer>
  );
}
