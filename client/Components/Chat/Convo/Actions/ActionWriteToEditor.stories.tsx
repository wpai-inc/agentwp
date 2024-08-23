import type { Meta, StoryObj } from '@storybook/react';

import ActionWriteToEditor from './ActionWriteToEditor';

const meta: Meta< typeof ActionWriteToEditor > = {
  title: 'Chat/Convo/Actions/ActionWriteToEditor',
  component: ActionWriteToEditor,
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
