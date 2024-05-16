import React from 'react';
import type { Preview } from '@storybook/react';
import '@/assets/styles/app.css';
import App from '../client/Shared/App';
import ChatProvider from '../client/Providers/ChatProvider';
import ClientSettingsProvider from '../client/Providers/ClientSettingsProvider';
import ScreenProvider from '../client/Providers/ScreenProvider';
import StreamProvider from '../client/Providers/StreamProvider';
import ActionListenerProvider from '../client/Providers/ActionListenerProvider';
import UserRequestsProvider from '../client/Providers/UserRequestsProvider';
import { PageProvider } from '../client/Providers/PageProvider';
import type { PageData } from '../client/Types/types';
import { ClientProvider } from '../client/Providers/ClientProvider';
import { AdminRouteProvider } from '../client/Providers/AdminRouteProvider';

const page = {
  home_url: 'http://localhost:8080',
  plugin_url: 'http:e//localhost:8080/wp-content/plugins/agent-wp/',
  nonce: '4424287981',
  wp_rest_nonce: 'b6548995e0',
  site_id: '9c088a0d-d543-4148-9e55-fe1d38eae2e4',
  client_id: '9c088a0d-d953-498e-b9a7-5b9cf7001ce1',
  api_host: 'http://localhost',
  rest_route: 'http://localhost:8080/index.php?rest_route=/',
  rest_endpoint: 'agentwp/v1',
  user: {
    ID: '1',
    user_email: 'greg@codewp.ai',
    user_login: 'greg',
    user_nicename: 'greg',
    display_name: 'greg',
    roles: ['administrator'],
  },
  is_admin: true,
  agentwp_manager: true,
  agentwp_users_manager: true,
  agentwp_access: true,
  access_token: 'mock-access-token',
  onboarding_completed: false,
} as PageData;

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'wordpress',
      values: [
        {
          name: 'wordpress',
          value: '#f0f0f1',
        },
        {
          name: 'chatContainer',
          value: '#ffffff',
        },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z ].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    darkMode: {
      defaultValue: true,
    },
  },
  decorators: [
    function (Story, { parameters }) {
      return (
        <PageProvider page={page}>
          <App>
            <AdminRouteProvider>
              <ClientProvider>
                <ClientSettingsProvider>
                  <ScreenProvider>
                    <UserRequestsProvider messages={parameters.messages}>
                      <StreamProvider>
                        <ActionListenerProvider>
                          <ChatProvider defaultOpen={parameters.open}>
                            <Story />
                          </ChatProvider>
                        </ActionListenerProvider>
                      </StreamProvider>
                    </UserRequestsProvider>
                  </ScreenProvider>
                </ClientSettingsProvider>
              </ClientProvider>
            </AdminRouteProvider>
          </App>
        </PageProvider>
      );
    },
  ],
};

export const parameters = {};
export default preview;
