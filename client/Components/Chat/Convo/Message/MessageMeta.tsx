import useCopy from '@/Hooks/copy';

type Meta = {
  label: string;
  value: number | string;
};

export default function MessageMeta( { meta }: { meta: Meta[] } ) {
  return (
    <dl className="text-sm text-brand-dark space-y-2">
      { meta.map( ( m, i ) => <Item key={ i } { ...m } /> ) }
    </dl>
  );
}

function Item( { label, value, ...props } : Meta ) {
    const { copy, copied } = useCopy();

    return (
        <div onClick={() => copy(value)} className="cursor-copy grid grid-cols-2 gap-4" {...props}>
          <dt className="text-right font-semibold leading-tight">{ label }</dt>
          <dd className="text-ellipsis text-nowrap overflow-clip">
            { copied ? 'Copied!' : value }
          </dd>
        </div>
    );
  }