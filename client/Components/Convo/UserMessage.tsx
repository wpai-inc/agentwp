import MD from '@/Components/MD';

export default function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 flex items-center justify-center font-bold bg-green-500 text-white rounded-full">
        U
      </div>
      <div className="flex-1">
        <MD>{message}</MD>
      </div>
    </div>
  );
}
