import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import { PageProvider } from '@/Providers/PageProvider';
import type { PageData } from '@/Types/types';
import { ClientProvider } from '@/Providers/ClientProvider';
import { AdminRouteProvider } from '@/Providers/AdminRouteProvider';
import LatestConvos from './Partials/LatestConvos';
import '@/assets/styles/app.css';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import Footer from './Partials/Footer';

const rootElement = document.getElementById( 'agentwp-admin-dashboardwidget' );

declare const agentwp_settings: PageData;

if ( rootElement ) {
  const root = ReactDOM.createRoot( rootElement );
  const wpWidgetStyleReset = { margin: '-11px -12px -12px -12px' };
  root.render(
    <StrictMode>
      <PageProvider page={ agentwp_settings }>
        <NotificationsProvider>
          <ErrorProvider>
            <AdminRouteProvider>
              <ClientProvider>
                <ClientSettingsProvider>
                  <div style={ wpWidgetStyleReset }>
                    <LatestConvos />
                    <Footer />
                  </div>
                </ClientSettingsProvider>
              </ClientProvider>
            </AdminRouteProvider>
          </ErrorProvider>
        </NotificationsProvider>
      </PageProvider>
    </StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
