import React from 'react';
import ReactDOM from 'react-dom/client';
import { PageProvider } from '@/Providers/PageProvider';
import Settings from './Settings';
import Wizard from './Wizard';
import type { SettingsPageData } from '@/Types/types';
import { RestRequestProvider } from '@/Providers/RestRequestProvider';
import { NotificationsProvider } from '@/Providers/NotificationProvider';
import { ErrorProvider } from '@/Providers/ErrorProvider';
import { AWPRootType } from '@/Types/types';
import ClientSettingsProvider from '@/Providers/ClientSettingsProvider';
import { AccountProvider } from '@/Providers/AccountProvider';

declare global {
  interface Window {
    agentwp: AWPRootType;
  }
}

const rootElement = document.getElementById( 'agentwp-admin-settings' );

declare const agentwpData: SettingsPageData;

if ( rootElement ) {
  const root = ReactDOM.createRoot( rootElement );
  window.agentwp = rootElement as AWPRootType;

  root.render(
    <React.StrictMode>
      <PageProvider page={ agentwpData }>
        <NotificationsProvider>
          <ErrorProvider>
            <RestRequestProvider>
              <AccountProvider>
                <ClientSettingsProvider>
                  { agentwpData?.onboarding_completed ? <Settings /> : <Wizard /> }
                </ClientSettingsProvider>
              </AccountProvider>
            </RestRequestProvider>
          </ErrorProvider>
        </NotificationsProvider>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error( 'Root element not found' );
}
