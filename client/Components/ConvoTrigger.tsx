import { cn } from '@/lib/utils';
import { ChatCircle } from '@phosphor-icons/react';
import { useChat } from '@/Providers/ChatProvider';

export default function ConvoTrigger() {
  const { open, toggle } = useChat();
  return (
    <button
      onClick={toggle}
      className={cn(
        'fixed opacity-0 bottom-4 right-4 bg-white p-2 rounded-full shadow-xl transition',
        {
          'z-50 opacity-100 transition': open,
        },
      )}
    >
      <ChatCircle size="32" />
    </button>
  );
}
