import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
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
import { Notifications } from '@/Components/Notifications';

const rootElement = document.getElementById( 'agent-wp-admin-chat' );

declare const agentwp_settings: PageData;

if ( rootElement ) {
  const root = ReactDOM.createRoot( rootElement );
  root.render(
    <React.StrictMode>
      <PageProvider page={ agentwp_settings }>
        <NotificationsProvider>
          <App>
            <AdminRouteProvider>
              <ClientProvider>
                <ClientSettingsProvider>
                  <ScreenProvider>
                    <UserRequestsProvider>
                      <StreamProvider>
                        <ActionListenerProvider>
                          <ChatProvider>
                            <Chat />
                          </ChatProvider>
                        </ActionListenerProvider>
                      </StreamProvider>
                    </UserRequestsProvider>
                  </ScreenProvider>
                </ClientSettingsProvider>
              </ClientProvider>
            </AdminRouteProvider>
          </App>
        </NotificationsProvider>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
