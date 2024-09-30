import AppProvider from '@/Providers/AppProvider';
import AppWrapper from '@/Page/Admin/Chat/Partials/AppWrapper';
import ChatConnected from './Chat/ChatConnected';
import { usePage } from '@/Providers/PageProvider';
import { PageData } from '@/Types/types';
import ChatDisconnected from './Chat/ChatDisconnected';

export default function ChatApp( { inline = false }: { inline?: boolean } ) {
  const { isConnected } = usePage< PageData >();

  return (
    <AppProvider>
      <AppWrapper>
        { isConnected ? (
          <ChatConnected inline={ inline } />
        ) : (
          <ChatDisconnected inline={ inline } />
        ) }
      </AppWrapper>
    </AppProvider>
  );
}
