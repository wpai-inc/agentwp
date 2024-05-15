import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import ConvoContainer from '@/Components/ConvoContainer';
import ChatProvider from '@/Providers/ChatProvider';
import ConvoTrigger from '@/Components/ConvoTrigger';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import ScreenProvider from '@/Providers/ScreenProvider';
import StreamProvider from '@/Providers/StreamProvider';
import ActionListenerProvider from '@/Providers/ActionListenerProvider';
import UserRequestsProvider from '@/Providers/UserRequestsProvider';
import { PageProvider } from '@/Providers/PageProvider';
import type { agentwpSettings } from "@/Types/types";
import { ClientProvider } from '@/Providers/ClientProvider';


const rootElement = document.getElementById('agent-wp-admin-chat');

declare const agent_wp_admin_chat: any;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PageProvider page={agent_wp_admin_chat}>
        <App>
          <ClientProvider>
            <ClientSettingsProvider>
              <ScreenProvider>
                <UserRequestsProvider>
                  <StreamProvider>
                    <ActionListenerProvider>
                      <ChatProvider>
                        <ConvoContainer />
                        <ConvoTrigger />
                      </ChatProvider>
                    </ActionListenerProvider>
                  </StreamProvider>
                </UserRequestsProvider>
              </ScreenProvider>
            </ClientSettingsProvider>
          </ClientProvider>
        </App>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error('Root element not found');
}
