import React from 'react';
import Handle from './Handle';

export default function DragHandles() {
  return (
    <>
      <Handle position={'top-left'} />
      <Handle position={'top-right'} />
      <Handle position={'bottom-left'} />
      <Handle position={'bottom-right'} />
    </>
  );
};
