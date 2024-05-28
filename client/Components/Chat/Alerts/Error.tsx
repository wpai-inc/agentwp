import IconError from '@material-design-icons/svg/outlined/error.svg?react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

type Props = {
  errors: string[];
};

export function ChatError({
  errors,
}: Props) {
  return (
    <Alert
      variant="destructive"
      className={cn(
        'absolute w-[95%] py-2 bg-red-100 text-red-700',
        'bottom-0 rounded-md'
      )}
    >
      {errors.map((err: any) => (
        <AlertDescription key={err.id}>{err.message}</AlertDescription>
      ))}
    </Alert>
  );
}
