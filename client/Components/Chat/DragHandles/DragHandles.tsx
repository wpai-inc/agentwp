import Handle from './Handle';

export default function DragHandles() {
  return (
    <>
      <Handle position={ 'top' } />
      <Handle position={ 'bottom' } />
      <Handle position={ 'left' } />
      <Handle position={ 'right' } />
    </>
  );
}
