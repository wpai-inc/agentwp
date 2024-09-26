import AppProvider from '@/Providers/AppProvider';
import AppWrapper from '@/Page/Admin/Chat/Partials/AppWrapper';
import ChatConnected from './Chat/ChatConnected';
import { usePage } from '@/Providers/PageProvider';
import { PageData } from '@/Types/types';
import ChatDisconnected from './Chat/ChatDisconnected';

export default function ChatApp( { inline = false }: { inline?: boolean } ) {
  const { page } = usePage< PageData >();

  return (
    <AppProvider>
      <AppWrapper>
        { page.is_connected ? (
          <ChatConnected inline={ inline } />
        ) : (
          <ChatDisconnected inline={ inline } />
        ) }
      </AppWrapper>
    </AppProvider>
  );
}
