import { XSquare } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from './Dialog';
import MessageBox from './MessageBox';

export default function ConvoContainer() {
  const { open, toggle } = useChat();

  return (
    <div
      className={cn(
        'transition fixed bottom-4 right-4 pt-[32px] h-[800px] w-[500px] z-50 bg-gray-100 shadow-xl flex flex-col border border-gray-200 rounded-xl',
        {
          'translate-x-full': !open,
        },
      )}
    >
      <button
        className="absolute p-2 -right-4 -top-4 bg-gray-100 border border-gray-200 rounded-xl"
        onClick={toggle}
      >
        <XSquare size="28" />
      </button>
      <Dialog />
      <MessageBox />
    </div>
  );
}
