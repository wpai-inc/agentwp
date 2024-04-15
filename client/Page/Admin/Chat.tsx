import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import ConvoContainer from '@/Components/ConvoContainer';
import ChatProvider from '@/Providers/ChatProvider';
import ConvoTrigger from '@/Components/ConvoTrigger';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
const rootElement = document.getElementById('agent-wp-admin-chat');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App>
        <ClientSettingsProvider>
          <ChatProvider>
            <ConvoContainer />
            <ConvoTrigger />
          </ChatProvider>
        </ClientSettingsProvider>
      </App>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error('Root element not found');
}
