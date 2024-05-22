import { LoaderIcon } from 'lucide-react';

export default function ActionPending() {
  return (
    <div className="p-4 rounded-lg border border-gray-25 flex gap-2 items-center">
      <LoaderIcon className="animate-spin" /> Thinking...
    </div>
  );
}
