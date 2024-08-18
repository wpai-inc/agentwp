import ChatTopBar from '@/Page/Admin/Chat/Partials/ChatTopBar';
import HotKeyProvider from '@/Providers/HotKeyProvider';
import Conversation from './Convo/Conversation';

export default function StaticChat() {
  return (
    <HotKeyProvider>
      <div className="bg-brand-gray shadow-xl flex flex-col border-gray-200 rounded-xl origin-bottom-right w-full h-full">
        <ChatTopBar />
        <Conversation />
      </div>
    </HotKeyProvider>
  );
}
