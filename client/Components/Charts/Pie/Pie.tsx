import { useMemo } from 'react';
import { Chart } from '@wpai/schemas';
import { makeChartConfig } from '@/Components/Charts/utils';
import { PieChart, Pie, Label } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/Components/ui/chart';

const COLORS = [ '#4991F7', '#FF70A6', '#FFD76D', '#6DD7B9', '#FFA36C', '#A36CFF' ];

export default function Component( {
  chart,
  data,
}: {
  chart: Chart;
  data: {
    [ key: string ]: number;
  }[];
} ) {
  const { xAxisKey } = chart;
  const chartConfig = makeChartConfig( chart );
  const { key, label } = chart.dataKeys[ 0 ];
  const total = useMemo( () => {
    return data.reduce( ( acc, curr ) => acc + curr[ key ], 0 );
  }, [] );

  const pieData = data.map( ( item, index ) => ( {
    ...item,
    fill: COLORS[ index % COLORS.length ],
  } ) );

  return (
    <ChartContainer config={ chartConfig } className="mx-auto aspect-square max-h-[250px] w-full">
      <PieChart>
        <ChartTooltip cursor={ false } content={ <ChartTooltipContent hideLabel /> } />
        <Pie
          data={ pieData }
          dataKey={ key }
          nameKey={ xAxisKey }
          innerRadius={ 60 }
          strokeWidth={ 5 }>
          <Label
            content={ ( { viewBox } ) => {
              if ( viewBox && 'cx' in viewBox && 'cy' in viewBox ) {
                return (
                  <text
                    x={ viewBox.cx }
                    y={ viewBox.cy }
                    textAnchor="middle"
                    dominantBaseline="middle">
                    <tspan
                      x={ viewBox.cx }
                      y={ viewBox.cy }
                      className="fill-foreground text-3xl font-bold">
                      { total.toLocaleString() }
                    </tspan>
                    <tspan
                      x={ viewBox.cx }
                      y={ ( viewBox.cy || 0 ) + 24 }
                      className="fill-muted-foreground">
                      { label }
                    </tspan>
                  </text>
                );
              }
            } }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
