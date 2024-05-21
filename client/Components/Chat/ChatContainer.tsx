import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from './MessageBox/MessageBox';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import ChatOverlay from '@/Components/Chat/ChatOverlay';

export default function ChatContainer() {
  const windowRef = useRef<HTMLDivElement>(null);
  const {
    open,
    minimizing,
    expanding,
    maximizing,
    reducing,
    isMaximized,
  } = useChat();
  const { settings, setSettings } = useClientSettings();
  const { conversation, overlayChildren } = useChat();

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
      id="awp-chat"
      className={cn(
        'transition fixed bottom-4 right-10',
        'h-[85vh] w-[500px] z-20 bg-brand-gray',
        'shadow-xl flex flex-col border border-gray-200 rounded-xl opacity-100',
        {
          'w-0 h-0 overflow-hidden border-0': !open,
          minimize: minimizing,
          expand: expanding,
          maximize: maximizing,
          reduce: reducing,
          maximized: isMaximized,
        },
      )}
    >
      <div className="minimize-overlay"></div>
      <ChatTopBar />
      <div className="h-full flex flex-col relative">
        <Dialog conversation={conversation} />
        <MessageBox />
        <WindowActions />
        {overlayChildren && (
          <ChatOverlay>
            {overlayChildren}
          </ChatOverlay>
        )}
      </div>
    </div>
  );
}
