import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';
import React from 'react';

export function ChatNotice( { children }: { children: React.ReactNode } ) {
  return (
    <div className="absolute bottom-0 right-0 left-0 z-20 px-2">
      <Alert variant="informative" className={ cn( 'w-full py-2' ) }>
        <AlertDescription>{ children }</AlertDescription>
      </Alert>
    </div>
  );
}
