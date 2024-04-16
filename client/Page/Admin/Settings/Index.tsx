import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import { GeneralForm } from './Partials/GeneralForm';
import { PageProvider } from '@/Providers/PageProvider';

const rootElement = document.getElementById('agent-wp-admin-settings');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PageProvider page={(window as any)['agent_wp_admin_settings']}>
        <App>
          <div className="m-12">
            <div>
              <h1 className="text-2xl font-bold">AgentWP Settings</h1>
            </div>
            <GeneralForm />
          </div>
        </App>
      </PageProvider>
    </React.StrictMode>,
  );
} else {
  // Handle the case where the root element is not found
  console.error('Root element not found');
}
