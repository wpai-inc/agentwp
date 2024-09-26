import { ContextMenu, ContextMenuItem } from '@/Components/ui/context-menu';
import useCopy from '@/Hooks/copy';
import { cn } from '@/lib/utils';

type Meta = {
  label: string;
  onClick?: () => void;
};

export default function MessageMeta( { meta }: { meta: Meta[] } ) {
  return meta.map( ( m, i ) => <Item key={ i } { ...m } /> );
}

function Item( { label, onClick, ...props }: Meta ) {
  // const isValue = typeof value === 'string' || typeof value === 'number';
  // const { copy, copied } = useCopy();

  return (
    <ContextMenu>
      <ContextMenuItem onClick={ onClick } { ...props }>
        { label }
      </ContextMenuItem>
    </ContextMenu>
  );
}
