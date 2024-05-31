import React from 'react';
import Handle from './Handle';

export default function DragHandles({
  isShowing = false,
}) {
  return (
    <>
      <Handle
        isShowing={isShowing}
        position={'top-left'}
      />
      <Handle
        isShowing={isShowing}
        position={'top-right'}
      />
      <Handle
        isShowing={isShowing}
        position={'bottom-left'}
      />
      <Handle
        isShowing={isShowing}
        position={'bottom-right'}
      />
    </>
  );
};
