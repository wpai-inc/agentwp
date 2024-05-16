import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from './MessageBox/MessageBox';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

export default function ChatContainer() {
  const windowRef = useRef<HTMLDivElement>(null);
  const { open, minimizing, expanding } = useChat();
  const { settings, setSettings } = useClientSettings();
  const { conversation } = useChat();

  useEffect(() => {
    const windowElement = windowRef.current;
    if (windowElement) {
      windowElement.style.left = settings.x + 'px';
      windowElement.style.top = settings.y + 'px';

      const resetChatWindow = () => {
        windowElement.style.top = '';
        windowElement.style.left = '';
        setSettings({
          x: null,
          y: null,
        });
      };

      window.addEventListener('resize', resetChatWindow);

      return () => {
        window.removeEventListener('resize', resetChatWindow);
      };
    }
  }, []);

  return (
    <div
      ref={windowRef}
      className={cn(
        'transition fixed bottom-4 right-10',
        'max-h-[95vh] min-h-[500px] w-[500px] z-[1000] bg-brand-gray',
        'shadow-xl flex flex-col border border-gray-200 rounded-xl',
        {
          'w-0 h-0 overflow-hidden': !open,
          minimize: minimizing,
          expand: expanding,
        },
      )}
    >
      <div className="minimize-overlay"></div>
      <ChatTopBar />
      <Dialog conversation={conversation} />
      <MessageBox />
      <WindowActions />
    </div>
  );
}
