import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import type { PageData } from '@/Types/types';
import { AWPRootType } from '@/Types/types';
import ChatApp from '@/Components/Chat';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { PageProvider } from '@/Providers/PageProvider';
import styles from '@/assets/styles/inline-app.css?inline';

declare global {
  interface Window {
    agentwp: AWPRootType;
  }
}

declare const agentwpData: PageData;

const rootElement = document.getElementById( 'agentwp-admin-chat' ) as AWPRootType;
if ( rootElement ) {
  window.agentwp = rootElement;
  const reactRoot = ReactDOM.createRoot( rootElement );
  reactRoot.render(
    <StrictMode>
      <NotificationsProvider>
        <PageProvider page={ agentwpData }>
          <ChatApp />
          <style type="text/css">{ styles }</style>
        </PageProvider>
      </NotificationsProvider>
    </StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
