import { useEffect, useRef } from "react";
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from './Dialog';
import MessageBox from './MessageBox';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

export default function ConvoContainer() {
  const windowRef = useRef(null);
  const { open } = useChat();
  const { settings } = useClientSettings();

  useEffect(() => {
    const windowElement = windowRef.current;
    windowElement.style.left = settings.x;
    windowElement.style.top = settings.y;
  }, []);

  return (
    <div
      ref={windowRef}
      className={cn(
        'transition fixed bottom-4 right-10',
        'h-[90vh] w-[500px] z-[1000] bg-brand-gray',
        'shadow-xl flex flex-col border border-gray-200 rounded-xl',
        {
          'translate-x-full': !open,
        },
      )}
    >
      <ChatTopBar />
      <Dialog />
      <MessageBox />
      <WindowActions />
    </div>
  );
}
