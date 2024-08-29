import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import HotKeyProvider from '@/Providers/HotKeyProvider';
import Conversation from './Convo/Conversation';
import ChatContainer from './Partials/ChatContainer';

export default function StaticChat() {
  return (
    <HotKeyProvider>
      <ChatContainer id="agentwp-settings-chat" className="w-full h-full max-h-screen">
        <ChatTopBar />
        <Conversation />
      </ChatContainer>
    </HotKeyProvider>
  );
}
