import { Spinner } from '@/Components/Spinner';

export default function ActionPending( { message = 'Thinking...' }: { message?: string } ) {
  return (
    <div className="flex gap-2 items-center border border-brand-gray-25 rounded-lg py-1.5 px-2">
      <Spinner show={ true } />
      <span>{ message }</span>
    </div>
  );
}
