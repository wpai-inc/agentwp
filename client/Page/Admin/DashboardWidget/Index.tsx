import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import { PageProvider } from '@/Providers/PageProvider';
import type { PageData } from '@/Types/types';
import { RestRequestProvider } from '@/Providers/RestRequestProvider';
import LatestConvos from './Partials/LatestConvos';
import '@/assets/styles/app.css';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import Footer from './Partials/Footer';
import { AccountProvider } from '@/Providers/AccountProvider';

const rootElement = document.getElementById( 'agentwp-admin-dashboardwidget' );

declare const agentwpData: PageData;

if ( rootElement ) {
  const root = ReactDOM.createRoot( rootElement );
  const wpWidgetStyleReset = { margin: '-11px -12px -12px -12px' };
  root.render(
    <StrictMode>
      <PageProvider page={ agentwpData }>
        <NotificationsProvider>
          <ErrorProvider>
            <RestRequestProvider>
              <AccountProvider>
                <ClientSettingsProvider>
                  <div style={ wpWidgetStyleReset }>
                    <LatestConvos />
                    <Footer />
                  </div>
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
