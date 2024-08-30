import ChatOverlay from '@/Components/Chat/ChatOverlay';
import Conversation from '@/Components/Chat/Convo/Conversation';
import UpdateNotification from '@/Components/Chat/Partials/UpdateNotification';

export default function ChatCore() {
  return (
    <>
      <UpdateNotification />
      <Conversation />
      <ChatOverlay />
    </>
  );
}
