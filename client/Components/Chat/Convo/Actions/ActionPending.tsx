import { Spinner } from '@/Components/Spinner';

export default function ActionPending() {
  return (
    <div className="p-4 rounded-lg border border-gray-25 flex gap-2 items-center">
      <Spinner show={ true } /> Thinking...
    </div>
  );
}
