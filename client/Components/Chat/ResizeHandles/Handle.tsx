import { cn } from '@/lib/utils';
import { ResizeSide } from '@/Hooks/position';

export default function Handle( {
  position,
  resizeHandler,
}: {
  position: ResizeSide;
  resizeHandler: ( e: MouseEvent, side: ResizeSide ) => void;
} ) {
  return (
    <div
      className={ cn( 'absolute z-10', {
        '-top-1 -left-1 -right-1 cursor-ns-resize h-2': position === 'top',
        '-bottom-1 -left-1  -right-1 cursor-ns-resize h-2': position === 'bottom',
        '-top-1 -bottom-1 -left-1 cursor-ew-resize w-2': position === 'left',
        '-top-1  -bottom-1 -right-1 cursor-ew-resize w-2': position === 'right',
      } ) }
      onMouseDown={ e => resizeHandler( e.nativeEvent, position ) }></div>
  );
}
