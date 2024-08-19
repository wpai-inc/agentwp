import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from '@/Components/Chat/MessageBox/MessageBox';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import { useApp } from '@/Providers/AppProvider';
import { TokenUsageStatus } from '@/Types/enums';
import OverCapacity from '@/Components/Chat/OverCapacity';

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
          <div className="relative mx-auto w-full max-w-screen-md">
            <div className="absolute -top-12 right-0 left-0 z-10 h-12 from-brand-gray to-transparent bg-gradient-to-t"></div>
            <div className="p-1.5">
              { tokenUsageStatus == TokenUsageStatus.Normal && <MessageBox /> }
              { tokenUsageStatus != TokenUsageStatus.Normal && (
                <OverCapacity cooldownTime={ cooldownTime } tokenUsageStatus={ tokenUsageStatus } />
              ) }
            </div>
          </div>
          <ChatOverlay />
        </>
      ) }
    </div>
  );
}
