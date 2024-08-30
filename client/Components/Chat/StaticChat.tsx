import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import HotKeyProvider from '@/Providers/HotKeyProvider';
import ChatContainer from './Partials/ChatContainer';
import ChatCore from './Partials/ChatCore';

export default function StaticChat() {
  return (
    <HotKeyProvider>
      <ChatContainer id="agentwp-settings-chat" className="relative h-full max-h-screen w-full">
        <ChatTopBar />
        <ChatCore />
      </ChatContainer>
    </HotKeyProvider>
  );
}
