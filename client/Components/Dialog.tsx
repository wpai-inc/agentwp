import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';

export default function Dialog() {
  const { conversation } = useChat();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 text-white flex flex-col justify-end">
        {conversation.map((item, index) => (
          <div
            key={index}
            className={cn('p-2 my-2 rounded-lg w-3/4', {
              'bg-blue-500/80 self-end': item.role === 'agent',
              'bg-green-500/80': item.role === 'user',
            })}
          >
            {item.message}
          </div>
        ))}
      </div>
    </div>
  );
}
