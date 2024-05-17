import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import { PageProvider } from '@/Providers/PageProvider';
import Settings from './Settings';
import Wizard from './Wizard';
import type { PageData } from '@/Types/types';
import { AdminRouteProvider } from '@/Providers/AdminRouteProvider';
import { NotificationsProvider } from '@/Providers/useNotificationsContext';
import { Notifications } from '@/Components/Notifications';

const rootElement = document.getElementById('agent-wp-admin-settings');

declare const agentwp_settings: PageData;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>

      <PageProvider page={agent_wp_admin_settings}>
        <NotificationsProvider>
          <App>
            <AdminRouteProvider>
              {agentwp_settings?.onboarding_completed ? (
                <Settings />
              ) : (
                <Wizard />
              )}
              <Notifications />
            </AdminRouteProvider>
          </App>
        </NotificationsProvider>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error('Root element not found');
}
