import Chat from '@/Components/Chat/Chat';
import StaticChat from '@/Components/Chat/StaticChat';
import ChatProvider from '@/Providers/ChatProvider';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import ScreenProvider from '@/Providers/ScreenProvider';
import StreamProvider from '@/Providers/StreamProvider';
import ActionListenerProvider from '@/Providers/ActionListenerProvider';
import UserRequestsProvider from '@/Providers/UserRequestsProvider';
import { RestRequestProvider } from '@/Providers/RestRequestProvider';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { InputSelectProvider } from '@/Providers/InputSelectProvider';
import StreamListenerProvider from '@/Providers/StreamListenerProvider';

export default function ChatConnected( { inline = false }: { inline?: boolean } ) {
  return (
    <ErrorProvider>
      <RestRequestProvider>
        <ClientSettingsProvider>
          <ScreenProvider>
            <UserRequestsProvider>
              <StreamProvider>
                <ActionListenerProvider>
                  <InputSelectProvider>
                    <ChatProvider>
                      <StreamListenerProvider>
                        { inline ? <StaticChat /> : <Chat /> }
                      </StreamListenerProvider>
                    </ChatProvider>
                  </InputSelectProvider>
                </ActionListenerProvider>
              </StreamProvider>
            </UserRequestsProvider>
          </ScreenProvider>
        </ClientSettingsProvider>
      </RestRequestProvider>
    </ErrorProvider>
  );
}
