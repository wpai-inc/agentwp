import Bar from '@/Components/Charts/Bar';
import Line from '@/Components/Charts/Line';
import Pie from '@/Components/Charts/Pie';
import BigNumberCard from '@/Components/Charts/BigNumberCard';
import { Chart, Visualization } from '@wpai/schemas';

export type DataProps = { [ key: string ]: number | string }[];

const visualizationComponents: {
  [ key in Visualization ]: React.ComponentType< any > | null;
} = {
  'bar-chart': Bar,
  'line-chart': Line,
  'donut-chart': Pie,
  'big-number-card': BigNumberCard,
  'conversational': null,
  'table': null,
};

type VisualizationProps =
  | { visualization: 'bar-chart'; data: DataProps; chart: Chart }
  | { visualization: 'line-chart'; data: DataProps; chart: Chart }
  | { visualization: 'donut-chart'; data: DataProps; chart: Chart }
  | { visualization: 'big-number-card'; data: DataProps; chart: Chart }
  | { visualization: 'conversational'; data: DataProps; chart?: Chart }
  | { visualization: 'table'; data: DataProps; chart?: Chart };

export default function Component( props: VisualizationProps ) {
  const Component = visualizationComponents[ props.visualization ];

  if ( ! Component ) return null;

  return (
    <div className="w-full">
      <Component { ...props } />
    </div>
  );
}
