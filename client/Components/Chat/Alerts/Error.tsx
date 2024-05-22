import IconError from '@material-design-icons/svg/outlined/error.svg?react';

import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';

export function ChatError( { children }: { children: React.ReactNode } ) {
  return (
    <Alert variant="destructive">
      <IconError className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{ children }</AlertDescription>
    </Alert>
  );
}
