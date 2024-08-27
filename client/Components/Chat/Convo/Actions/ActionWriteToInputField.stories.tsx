import type { Meta, StoryObj } from '@storybook/react';

import ActionWriteToInputField from './ActionWriteToInputField';

const meta: Meta< typeof ActionWriteToInputField > = {
  title: 'Chat/Convo/Actions/ActionWriteToInputField',
  component: ActionWriteToInputField,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Pending: Story = {
  args: {
    hasExecuted: false,
  },
};

export const Executed: Story = {
  args: {
    hasExecuted: true,
  },
};
