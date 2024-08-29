import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import HotKeyProvider from '@/Providers/HotKeyProvider';
import Conversation from './Convo/Conversation';
import ChatContainer from './Partials/ChatContainer';
import ChatOverlay from '@/Components/Chat/ChatOverlay';

export default function StaticChat() {
  return (
    <HotKeyProvider>
      <ChatContainer id="agentwp-settings-chat" className="relative h-full max-h-screen w-full">
        <ChatTopBar />
        <Conversation />
        <ChatOverlay />
      </ChatContainer>
    </HotKeyProvider>
  );
}
