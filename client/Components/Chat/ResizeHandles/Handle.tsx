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
      className={ cn( 'absolute z-10 group overflow-hidden', {
        'top-0 left-5 right-5 cursor-ns-resize h-1.5': position === 'top',
        'bottom-0 left-5 right-5 cursor-ns-resize h-1.5': position === 'bottom',
        'top-5 bottom-5 left-0 cursor-ew-resize w-1.5': position === 'left',
        'top-5  bottom-5 right-0 cursor-ew-resize w-1.5': position === 'right',
      } ) }
      onMouseDown={ e => resizeHandler( e.nativeEvent, position ) }>
      <div
        className={ cn( 'group-hover:bg-brand-primary transition', {
          'mt-0.5 h-1 w-full': position === 'bottom',
          'mb-0.5 h-1 w-full': position === 'top',
          'ml-0.5 w-1 h-full': position === 'right',
          'mr-0.5 w-1 h-full': position === 'left',
        } ) }></div>
    </div>
  );
}
