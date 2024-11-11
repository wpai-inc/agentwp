import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import { PageProvider } from '@/Providers/PageProvider';
import type { PageData } from '@/Types/types';
import { RestRequestProvider } from '@/Providers/RestRequestProvider';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { AccountProvider } from '@/Providers/AccountProvider';
import App from './App';

const rootElement = document.getElementById( 'agentwp-admin-dashboardwidget' );

declare const agentwpData: PageData;

if ( rootElement ) {
  const root = ReactDOM.createRoot( rootElement );
  root.render(
    <StrictMode>
      <PageProvider page={ agentwpData }>
        <NotificationsProvider>
          <ErrorProvider>
            <RestRequestProvider>
              <AccountProvider>
                <ClientSettingsProvider>
                  <App />
                </ClientSettingsProvider>
              </AccountProvider>
            </RestRequestProvider>
          </ErrorProvider>
        </NotificationsProvider>
      </PageProvider>
    </StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
