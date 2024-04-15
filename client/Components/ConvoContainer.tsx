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
        'transition fixed top-0 right-0 h-screen w-[500px] z-50 bg-white/90 shadow-xl flex flex-col pt-[38px]',
        {
          'translate-x-full': !open,
        },
      )}
    >
      <button className="p-2" onClick={toggle}>
        <XSquare size="28" />
      </button>
      <Dialog />
      <MessageBox />
    </div>
  );
}
