import { XSquare } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from './Dialog';
import MessageBox from './MessageBox';

import ChatTopBar from "@/Page/Admin/Chat/Partials/ChatTopBar";

export default function ConvoContainer() {
  const { open, toggle } = useChat();

  return (
    <div
      className={cn(
        'transition fixed bottom-4 right-4',
        'h-[90vh] w-[500px] z-[1000] bg-brand-gray',
        'shadow-xl flex flex-col border border-gray-200 rounded-xl',
        {
          'translate-x-full': !open,
        },
      )}
    >
      {/*<button*/}
      {/*  className="absolute p-2 -right-4 -top-4 bg-gray-100 border border-gray-200 rounded-xl"*/}
      {/*  onClick={toggle}*/}
      {/*>*/}
      {/*  <XSquare size="28" />*/}
      {/*</button>*/}
      <ChatTopBar />
      <Dialog />
      <MessageBox />
    </div>
  );
}
