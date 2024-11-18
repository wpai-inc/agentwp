import React from 'react';
import ReactDOM from 'react-dom/client';
import type { PageData } from '@/Types/types';
import { AWPRootType } from '@/Types/types';
import ChatApp from '@/Components/Chat';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { PageProvider } from '@/Providers/PageProvider';
import root from 'react-shadow';
import styles from '@/assets/styles/inline-app.css?inline';

declare global {
  interface Window {
    agentwp: AWPRootType;
  }
}

declare const agentwpData: PageData;

const rootElement = document.getElementById( 'agentwp-admin-chat' );
if ( rootElement ) {
  window.agentwp = rootElement as AWPRootType;
  const theRootElement = ReactDOM.createRoot( rootElement );
  theRootElement.render(
    <root.div id="agentwp-chat-shadow-root">
      <React.StrictMode>
        <NotificationsProvider>
          <PageProvider page={ agentwpData }>
            <ChatApp />
            <style type="text/css">{ styles }</style>
          </PageProvider>
        </NotificationsProvider>
      </React.StrictMode>
    </root.div>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
