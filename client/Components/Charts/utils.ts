import { Chart } from '@wpai/schemas';
import { ChartConfig } from '@/Components/ui/chart';

export function makeChartConfig( chart: Chart ): ChartConfig {
  return chart.dataKeys.reduce( ( acc, { key, label, color } ) => {
    acc[ key ] = {
      label,
      color,
    };
    return acc;
  }, {} as ChartConfig );
}

export function getDataKeys( chart: Chart ) {
  return chart.dataKeys.map( i => i.key );
}
