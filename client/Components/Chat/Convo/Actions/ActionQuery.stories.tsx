import type { Meta, StoryObj } from '@storybook/react';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

import ActionQuery from './ActionQuery';

const meta: Meta< typeof ActionQuery > = {
  title: 'Chat/Convo/Actions/ActionQuery',
  component: ActionQuery,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Pending: Story = {
  args: {
    hasExecuted: false,
    action: {
      sql: 'SELECT * FROM foo WHERE bar = 1',
    } as AgentAction,
  },
};

export const Executed: Story = {
  args: {
    hasExecuted: true,
    action: {
      sql: 'SELECT * FROM foo WHERE bar = 1',
    } as AgentAction,
  },
};
