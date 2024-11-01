import HotKeyProvider from '@/Providers/HotKeyProvider';
import ChatContainer from './Partials/ChatContainer';
import ChatCore from './Partials/ChatCore';

export default function StaticChat() {
  return (
    <HotKeyProvider>
      <ChatContainer
        id="agentwp-settings-chat"
        className="relative h-full max-h-screen min-w-[400px] w-full @container">
        <ChatCore />
      </ChatContainer>
    </HotKeyProvider>
  );
}
