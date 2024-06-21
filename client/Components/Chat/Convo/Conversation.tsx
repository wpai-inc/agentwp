import Dialog from '@/Components/Chat/Convo/Dialog';
import MessageBox from '@/Components/Chat/MessageBox/MessageBox';
import ChatOverlay from '@/Components/Chat/ChatOverlay';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';

export default function Conversation() {
  const { conversation, chatSetting } = useChat();
  const { loadingConversation } = useUserRequests();

  return (
    <div className="flex-1 flex flex-col relative overflow-auto">
      { loadingConversation ? (
        <LoadingScreen />
      ) : (
        <>
          <Dialog conversation={ conversation } />
          <div className="relative">
            <div className="absolute -top-12 right-0 left-0 z-10 h-12 from-brand-gray to-transparent bg-gradient-to-t"></div>
            <div className="p-1.5">
              <MessageBox />
            </div>
          </div>
          { chatSetting && (
            <ChatOverlay header={ chatSetting?.header }>{ chatSetting?.component }</ChatOverlay>
          ) }
        </>
      ) }
    </div>
  );
}
