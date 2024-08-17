import React from 'react';
import ReactDOM from 'react-dom/client';
import { PageProvider } from '@/Providers/PageProvider';
import Settings from './Settings';
import Wizard from './Wizard';
import type { PageData } from '@/Types/types';
import { AdminRouteProvider } from '@/Providers/AdminRouteProvider';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { ClientProvider } from '@/Providers/ClientProvider';
import { ErrorProvider } from '@/Providers/ErrorProvider';

import '@/assets/styles/app.css';

const rootElement = document.getElementById( 'agentwp-admin-settings' );

declare const agentwp_settings: PageData;

if ( rootElement ) {
  const root = ReactDOM.createRoot( rootElement );

  root.render(
    <React.StrictMode>
      <PageProvider page={ agentwp_settings }>
        <NotificationsProvider>
          <ErrorProvider>
            <AdminRouteProvider>
              <ClientProvider>
                { agentwp_settings?.onboarding_completed ? <Settings /> : <Wizard /> }
              </ClientProvider>
            </AdminRouteProvider>
          </ErrorProvider>
        </NotificationsProvider>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
