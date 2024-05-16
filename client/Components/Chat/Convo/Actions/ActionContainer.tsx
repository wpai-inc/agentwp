import { LoaderIcon } from 'lucide-react';

export default function ActionContainer({
  children,
  pending,
  icon,
}: {
  children: React.ReactNode;
  pending: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-brand-gray-25 p-2 rounded-lg flex gap-4 items-center my-2">
      {pending ? <LoaderIcon className="animate-spin" /> : icon}
      <div className="flex-1 truncate text-sm">{children}</div>
    </div>
  );
}
