import type { Meta, StoryObj } from '@storybook/react';

import ActionIncomplete from './ActionIncomplete';

const meta: Meta< typeof ActionIncomplete > = {
  title: 'Chat/Convo/Actions/ActionIncomplete',
  component: ActionIncomplete,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Retry: Story = {
  args: {
    userRequestId: 'fake',
  },
};
