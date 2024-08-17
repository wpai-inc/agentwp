import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProvider from '@/Providers/AppProvider';
import AppWrapper from '@/Page/Admin/Chat/Partials/AppWrapper';
import Chat from '@/Components/Chat/Chat';
import ChatProvider from '@/Providers/ChatProvider';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import ScreenProvider from '@/Providers/ScreenProvider';
import StreamProvider from '@/Providers/StreamProvider';
import ActionListenerProvider from '@/Providers/ActionListenerProvider';
import UserRequestsProvider from '@/Providers/UserRequestsProvider';
import { PageProvider } from '@/Providers/PageProvider';
import type { PageData } from '@/Types/types';
import { ClientProvider } from '@/Providers/ClientProvider';
import { AdminRouteProvider } from '@/Providers/AdminRouteProvider';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { InputSelectProvider } from '@/Providers/InputSelectProvider';
import StreamListenerProvider from '@/Providers/StreamListenerProvider';
import { AWPRootType } from '@/Types/types';
import '@/assets/styles/app.css';
declare global {
  interface Window {
    agentwp: AWPRootType;
  }
}

const rootElement = document.getElementById( 'agentwp-admin-chat' );
declare const agentwp_settings: PageData;

if ( rootElement ) {
  window.agentwp = rootElement as AWPRootType;
  const root = ReactDOM.createRoot( rootElement );
  root.render(
    <React.StrictMode>
      <NotificationsProvider>
        <PageProvider page={ agentwp_settings }>
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
        </PageProvider>
      </NotificationsProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
