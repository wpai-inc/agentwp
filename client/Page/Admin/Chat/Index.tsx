import React from 'react';
import ReactDOM from 'react-dom/client';
import type { PageData } from '@/Types/types';
import { AWPRootType } from '@/Types/types';
import ChatApp from '@/Components/Chat';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { PageProvider } from '@/Providers/PageProvider';

declare global {
  interface Window {
    agentwp: AWPRootType;
  }
}

declare const agentwpData: PageData;

const rootElement = document.getElementById( 'agentwp-admin-chat' );
if ( rootElement ) {
  window.agentwp = rootElement as AWPRootType;
  const root = ReactDOM.createRoot( rootElement );
  root.render(
    <React.StrictMode>
      <NotificationsProvider>
        <PageProvider page={ agentwpData }>
          <ChatApp />
        </PageProvider>
      </NotificationsProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
