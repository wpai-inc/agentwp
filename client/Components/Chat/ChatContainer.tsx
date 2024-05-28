import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/Providers/ChatProvider';
import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from './MessageBox/MessageBox';
import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import WindowActions from '@/Page/Admin/Chat/Partials/WindowActions';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import { ChatError } from './Alerts/Error';
import { useStream } from '@/Providers/StreamProvider';
import DragHandles from '@/Components/Chat/DragHandles/DragHandles';

export default function ChatContainer() {
  const windowRef = useRef< HTMLDivElement >(null);
  const { open, minimizing, expanding, maximizing, reducing, isMaximized } = useChat();
  const { settings, setSettings } = useClientSettings();
  const { conversation, overlayChildren } = useChat();
  const { streamError } = useStream();

  useEffect(() => {
    const windowElement = windowRef.current;
    if ( windowElement ) {
      windowElement.style.transform = `translate(${ settings.x }px, ${ settings.y }px)`;

      const resetChatWindow = () => {
        windowElement.style.transform = `translate(0px, 0px)`;
        setSettings( {
          x: 0,
          y: 0,
        } );
      };

      window.addEventListener( 'resize', resetChatWindow );

      return () => {
        window.removeEventListener( 'resize', resetChatWindow );
      };
    }
  }, []);

  return (
    <div
      ref={windowRef}
      id="awp-chat"
      className={ cn(
        'fixed bottom-4 right-10',
        'h-[85vh] w-[500px] z-[999] bg-brand-gray',
        'shadow-xl transition-shadow duration-500 flex flex-col ',
        'border border-gray-200 rounded-xl opacity-100',
        {
          'w-0 h-0 overflow-hidden border-0': ! open,
          'minimize': minimizing,
          'expand': expanding,
          'maximize shadow-3xl': maximizing,
          'maximized shadow-3xl': isMaximized,
          'reduce shadow-xl': reducing,
        },
      ) }>
      <div className="minimize-overlay"></div>
      <ChatTopBar />
      <div className="h-full flex flex-col relative">
        <Dialog conversation={conversation} />
        <div className="p-2">
          {streamError && <ChatError>{ streamError }</ChatError>}
          <MessageBox />
        </div>
        <WindowActions />
        {overlayChildren && <ChatOverlay>{overlayChildren}</ChatOverlay>}
      </div>
      {(!maximizing && !isMaximized) && <DragHandles />}
    </div>
  );
}
