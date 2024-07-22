import { ResizeSide } from '@/Hooks/position';
import Handle from './Handle';

export default function ResizeHandles( {
  resizeHandler,
}: {
  resizeHandler: ( e: MouseEvent, side: ResizeSide ) => void;
} ) {
  return (
    <>
      <Handle position={ 'top' } resizeHandler={ resizeHandler } />
      <Handle position={ 'bottom' } resizeHandler={ resizeHandler } />
      <Handle position={ 'left' } resizeHandler={ resizeHandler } />
      <Handle position={ 'right' } resizeHandler={ resizeHandler } />
    </>
  );
}
