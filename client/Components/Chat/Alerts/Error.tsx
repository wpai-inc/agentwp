import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

type Props = {
  errors: string[];
};

export function ChatError( { errors }: Props ) {
  return (
    <div className="absolute bottom-0 right-0 left-0 z-20 px-2">
      <Alert variant="destructive" className={ cn( 'w-full bg-red-100 text-red-700 py-2' ) }>
        { errors.map( ( err: any ) => (
          <AlertDescription key={ err.id }>{ err.message }</AlertDescription>
        ) ) }
      </Alert>
    </div>
  );
}
