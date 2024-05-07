import React from "react";
import type { Preview } from '@storybook/react';
import '@/assets/styles/app.css';

const preview: Preview = {
  parameters: {
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
    Story => (
      <div>
        <Story />
      </div>
    )
  ]
};

export const parameters = {};
export default preview;
