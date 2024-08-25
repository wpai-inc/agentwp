import { ResizeSide } from '@/Hooks/position';
import Handle from './Handle';

export default function ResizeHandles( {
  resizeHandler,
}: {
  resizeHandler: ( e: MouseEvent, side: ResizeSide ) => void;
} ) {
  return (
    <>
      <Handle position={ 't' } resizeHandler={ resizeHandler } />
      <Handle position={ 'b' } resizeHandler={ resizeHandler } />
      <Handle position={ 'l' } resizeHandler={ resizeHandler } />
      <Handle position={ 'r' } resizeHandler={ resizeHandler } />
      <Handle position={ 'tl' } resizeHandler={ resizeHandler } />
      <Handle position={ 'tr' } resizeHandler={ resizeHandler } />
      <Handle position={ 'bl' } resizeHandler={ resizeHandler } />
      <Handle position={ 'br' } resizeHandler={ resizeHandler } />
    </>
  );
}
