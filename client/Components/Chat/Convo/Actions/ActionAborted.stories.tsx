import type { Meta, StoryObj } from '@storybook/react';

import ActionAborted from './ActionAborted';

const meta: Meta< typeof ActionAborted > = {
  title: 'Chat/Convo/Actions/ActionAborted',
  component: ActionAborted,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Action: Story = {
  args: {},
};
