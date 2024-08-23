import useCopy from '@/Hooks/copy';
import { cn } from '@/lib/utils';

type Meta = {
  label: string;
  value: number | string | React.ReactNode;
};

export default function MessageMeta( { meta }: { meta: Meta[] } ) {
  return (
    <dl className="text-sm text-brand-dark space-y-2">
      { meta.map( ( m, i ) => (
        <Item key={ i } { ...m } />
      ) ) }
    </dl>
  );
}

function Item( { label, value, ...props }: Meta ) {
  const isValue = typeof value === 'string' || typeof value === 'number';
  const { copy, copied } = useCopy();

  return (
    <div
      onClick={ () => ( isValue ? copy( value ) : null ) }
      className={ cn( 'grid grid-cols-2 gap-4 items-center', {
        'cursor-copy': isValue,
      } ) }
      { ...props }>
      <dt className="text-right font-semibold leading-tight">{ label }</dt>
      <dd className="text-ellipsis text-nowrap overflow-clip">{ copied ? 'Copied!' : value }</dd>
    </div>
  );
}
