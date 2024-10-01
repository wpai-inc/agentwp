import Dialog from '@/Components/Chat/Convo/Dialog';
import LoadingScreen from '@/Components/Chat/LoadingScreen';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useChat } from '@/Providers/ChatProvider';
import { useApp } from '@/Providers/AppProvider';
import ChatMessageUtilityBar from '@/Page/Admin/Chat/Partials/ChatMessageUtilityBar';
import ChatNotices from '@/Components/Chat/Notices/ChatNotices';
import ChatMessageInput from './Message/ChatMessageInput';
import TabContainer from '../Tabs/TabContainer';

export default function Conversation() {
  const { conversation, messageSubmitted, fetchMore, pagination } = useChat();
  const { loadingConversation } = useUserRequests();
  const { cooldownTime, tokenUsageStatus } = useApp();

  return (
    <TabContainer>
      { loadingConversation ? (
        <LoadingScreen />
      ) : (
        <>
          <Dialog
            conversation={ conversation }
            messageSubmitted={ messageSubmitted }
            pagination={ pagination }
            onScrollToTop={ fetchMore }
          />
          <div className="relative mx-auto w-full max-w-screen-md p-2 pb-0">
            <div className="mb-2 space-y-2">
              <ChatNotices />
              <ChatMessageUtilityBar />
            </div>
            <ChatMessageInput coolDownTime={ cooldownTime } tokenUsageStatus={ tokenUsageStatus } />
          </div>
        </>
      ) }
    </TabContainer>
  );
}
