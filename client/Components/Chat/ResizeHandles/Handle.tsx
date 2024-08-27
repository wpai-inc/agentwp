import { cn } from '@/lib/utils';
import { ResizeSide } from '@/Hooks/position';

export default function Handle( {
  position,
  resizeHandler,
}: {
  position: ResizeSide;
  resizeHandler: ( e: MouseEvent, side: ResizeSide ) => void;
} ) {
  type StyleObjectType = {
    [ key in ResizeSide ]?: React.CSSProperties;
  };

  const styles: StyleObjectType = {
    tl: { clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)' },
    tr: { clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' },
    bl: { clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' },
    br: { clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' },
  };

  return (
    <div
      className={ cn( 'absolute z-10 group overflow-hidden', {
        'top-0 left-5 right-5 cursor-ns-resize h-1.5': position === 't',
        'bottom-0 left-5 right-5 cursor-ns-resize h-1.5': position === 'b',
        'top-5 bottom-5 left-0 cursor-ew-resize w-1.5': position === 'l',
        'top-5 bottom-5 right-0 cursor-ew-resize w-1.5': position === 'r',
        'top-0 left-0 rounded-tl-xl cursor-nwse-resize': position === 'tl',
        'top-0 right-0 rounded-tr-xl cursor-nesw-resize': position === 'tr',
        'left-0 bottom-0 rounded-bl-xl cursor-nesw-resize': position === 'bl',
        'right-0 bottom-0 rounded-br-xl cursor-nwse-resize': position === 'br',
        'hover:border-brand-primary w-10 h-10 border border-4 border-transparent transition': [
          'tl',
          'tr',
          'bl',
          'br',
        ].includes( position ),
      } ) }
      style={ styles[ position ] }
      onMouseDown={ e => resizeHandler( e.nativeEvent, position ) }>
      <div
        className={ cn( 'group-hover:bg-brand-primary transition', {
          'mt-0.5 h-1 w-full': position === 'b',
          'mb-0.5 h-1 w-full': position === 't',
          'ml-0.5 w-1 h-full': position === 'r',
          'mr-0.5 w-1 h-full': position === 'l',
        } ) }></div>
    </div>
  );
}
