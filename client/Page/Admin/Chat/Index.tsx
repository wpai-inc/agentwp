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

const rootElement = document.getElementById('agent-wp-admin-chat');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App>
        <ClientSettingsProvider>
          <ScreenProvider>
            <StreamProvider>
              <ActionListenerProvider>
                <ChatProvider>
                  <ConvoContainer />
                  <ConvoTrigger />
                </ChatProvider>
              </ActionListenerProvider>
            </StreamProvider>
          </ScreenProvider>
        </ClientSettingsProvider>
      </App>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error('Root element not found');
}
