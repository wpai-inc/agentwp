import { Alert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

type Props = {
  message: string;
};

export function ChatNotice( { message }: Props ) {
  return (
    <div className="absolute bottom-0 right-0 left-0 z-20 px-2">
      <Alert variant="destructive" className={ cn( 'w-full bg-[#edacd2] text-pink-900 py-2' ) }>
        <AlertDescription>{ message }</AlertDescription>
      </Alert>
    </div>
  );
}
