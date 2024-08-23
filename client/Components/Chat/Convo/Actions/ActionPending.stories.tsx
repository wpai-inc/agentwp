import type { Meta, StoryObj } from '@storybook/react';

import ActionPending from './ActionPending';

const meta: Meta< typeof ActionPending > = {
  title: 'Chat/Convo/Actions/ActionPending',
  component: ActionPending,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Action: Story = {
  args: {},
};
