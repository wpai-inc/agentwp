import Dialog from '@/Components/Chat/Convo/Dialog';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import { useApp } from '@/Providers/AppProvider';
import ChatMessageUtilityBar from '@/Page/Admin/Chat/Partials/ChatMessageUtilityBar';
import ChatNotices from '@/Components/Chat/Notices/ChatNotices';
import ChatMessageInput from './Message/ChatMessageInput';

export default function Conversation() {
  const { conversation } = useChat();
  const { loadingConversation } = useUserRequests();
  const { cooldownTime, tokenUsageStatus } = useApp();

  return (
    <div className="flex-1 flex flex-col relative overflow-auto">
      { loadingConversation ? (
        <LoadingScreen />
      ) : (
        <>
          <Dialog conversation={ conversation } />
          <div className="relative mx-auto w-full max-w-screen-md p-1.5">
            <DialogFade />
            <div className="space-y-2 mb-2">
              <ChatNotices />
              <ChatMessageUtilityBar />
            </div>
            <ChatMessageInput coolDownTime={ cooldownTime } tokenUsageStatus={ tokenUsageStatus } />
          </div>
          <ChatOverlay />
        </>
      ) }
    </div>
  );
}

function DialogFade() {
  return (
    <div className="absolute -top-12 right-0 left-0 z-10 h-12 from-white to-transparent bg-gradient-to-t"></div>
  );
}
