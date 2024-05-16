import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import { PageProvider } from '@/Providers/PageProvider';
import Settings from './Settings';
import Wizard from './Wizard';
import type { PageData } from '@/Types/types';
import { AdminRouteProvider } from '@/Providers/AdminRouteProvider';

const rootElement = document.getElementById('agent-wp-admin-settings');

declare const agentwp_settings: PageData;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <PageProvider page={agentwp_settings}>
        <App>
          <AdminRouteProvider>
            {agentwp_settings?.onboarding_completed ? <Settings /> : <Wizard />}
          </AdminRouteProvider>
        </App>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error('Root element not found');
}
