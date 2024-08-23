import type { Meta, StoryObj } from '@storybook/react';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

import ActionNavigate from './ActionNavigate';

const meta: Meta< typeof ActionNavigate > = {
  title: 'Chat/Convo/Actions/ActionNavigate',
  component: ActionNavigate,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Pending: Story = {
  args: {
    hasExecuted: false,
    action: {
      url: 'https://example.com',
    } as AgentAction,
  },
};

export const Executed: Story = {
  args: {
    hasExecuted: true,
    action: {
      url: 'https://example.com',
    } as AgentAction,
  },
};
