import type { Meta, StoryObj } from '@storybook/react';

import OverCapacity from './OverCapacity';

const meta: Meta< typeof OverCapacity > = {
  component: OverCapacity,
};

export default meta;
type Story = StoryObj< typeof OverCapacity >;

export const OverCapacityStory: Story = {
  parameters: {},
};
