import { cn } from '@/lib/utils';
import { ChatCircle } from '@phosphor-icons/react';
import { useChat } from '@/Providers/ChatProvider';

export default function ConvoTrigger() {
  const { open, toggle, expanding } = useChat();

  return (
    <button
      onClick={toggle}
      className={cn(
        'fixed hidden bottom-4 right-4 p-2 rounded-full shadow-xl transition bg-white ring-2 ring-gray-200/80',
        {
          'z-50 block transition': !open,
          'hidden': expanding,
        },
      )}
    >
      <ChatCircle size="32" />
    </button>
  );
}
