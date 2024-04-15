import { XSquare } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from './Dialog';

export default function ConvoContainer() {
  const { open, toggle } = useChat();

  return (
    <div
      className={cn(
        'transition fixed top-[32px] right-0 h-screen w-[500px] z-50 bg-white shadow-xl',
        {
          'translate-x-full': open,
        },
      )}
    >
      <button className="bg-white p-2 absolute top-2 left-2" onClick={toggle}>
        <XSquare size="28" />
      </button>
      <Dialog />
    </div>
  );
}
