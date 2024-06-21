import Handle from './Handle';

export default function ResizeHandles( { resizeHandler } ) {
  return (
    <>
      <Handle position={ 'tl' } resizeHandler={ resizeHandler } />
      <Handle position={ 'bl' } resizeHandler={ resizeHandler } />
      <Handle position={ 'tr' } resizeHandler={ resizeHandler } />
      <Handle position={ 'br' } resizeHandler={ resizeHandler } />
    </>
  );
}
