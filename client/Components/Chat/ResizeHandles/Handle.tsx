import { cn } from '@/lib/utils';
import type { ResizeHandler } from '@/Hooks/position';

export default function Handle( {
  position,
  resizeHandler,
}: {
  position: 'tl' | 'tr' | 'br' | 'bl';
  resizeHandler: ResizeHandler;
} ) {
  function handleMouseDown( e: React.MouseEvent ) {
    e.preventDefault();
    const { clientX: startX, clientY: startY } = e;
    const { width, height } = document.body.getBoundingClientRect();

    resizeHandler( width, height );

    const handleMouseMove = ( e: MouseEvent ) => {
      const { clientX, clientY } = e;

      resizeHandler( clientX - startX, clientY - startY );
    };

    const handleMouseUp = () => {
      document.removeEventListener( 'mousemove', handleMouseMove );
      document.removeEventListener( 'mouseup', handleMouseUp );
    };

    document.addEventListener( 'mousemove', handleMouseMove );
    document.addEventListener( 'mouseup', handleMouseUp );
  }

  return (
    <div
      className={ cn( 'absolute z-10 w-5 h-5', {
        '-top-1 -left-1 cursor-nwse-resize': position === 'tl',
        '-bottom-1 -left-1 cursor-nesw-resize': position === 'bl',
        '-top-1 -right-1 cursor-nesw-resize': position === 'tr',
        '-bottom-1 -right-1 cursor-nwse-resize': position === 'br',
      } ) }
      onMouseDown={ handleMouseDown }></div>
  );
}
