import AppProvider from '@/Providers/AppProvider';
import AppWrapper from '@/Page/Admin/Chat/Partials/AppWrapper';
import Chat from '@/Components/Chat/Chat';
import ChatProvider from '@/Providers/ChatProvider';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import ScreenProvider from '@/Providers/ScreenProvider';
import StreamProvider from '@/Providers/StreamProvider';
import ActionListenerProvider from '@/Providers/ActionListenerProvider';
import UserRequestsProvider from '@/Providers/UserRequestsProvider';
import { ClientProvider } from '@/Providers/ClientProvider';
import { AdminRouteProvider } from '@/Providers/AdminRouteProvider';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { InputSelectProvider } from '@/Providers/InputSelectProvider';
import StreamListenerProvider from '@/Providers/StreamListenerProvider';

export default function ChatApp() {
  return (
    <AppProvider>
      <AppWrapper>
        <ErrorProvider>
          <AdminRouteProvider>
            <ClientProvider>
              <ClientSettingsProvider>
                <ScreenProvider>
                  <UserRequestsProvider>
                    <StreamProvider>
                      <ActionListenerProvider>
                        <InputSelectProvider>
                          <ChatProvider>
                            <StreamListenerProvider>
                              <Chat />
                            </StreamListenerProvider>
                          </ChatProvider>
                        </InputSelectProvider>
                      </ActionListenerProvider>
                    </StreamProvider>
                  </UserRequestsProvider>
                </ScreenProvider>
              </ClientSettingsProvider>
            </ClientProvider>
          </AdminRouteProvider>
        </ErrorProvider>
      </AppWrapper>
    </AppProvider>
  );
}
