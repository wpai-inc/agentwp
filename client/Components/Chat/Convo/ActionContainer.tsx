import { LoaderIcon } from 'lucide-react';

export default function ActionContainer({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) {
  return (
    <div className="bg-gray-300 p-2 rounded flex">
      <div className="flex-1">{children}</div>
      {pending && <LoaderIcon className="animate-spin" />}
    </div>
  );
}
