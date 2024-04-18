import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/Shared/App';
import { GeneralForm } from './Partials/GeneralForm';
import { PageProvider } from '@/Providers/PageProvider';
import setup from '@/lib/bootstrap';

const { rootElement, page } = setup('Admin/Settings');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PageProvider page={page}>
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
