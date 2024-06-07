import type { Meta, StoryObj } from '@storybook/react';

import Rate from './Rate';

const meta: Meta< typeof Rate > = {
  component: Rate,
};

export default meta;
type Story = StoryObj< typeof Rate >;

export const RateSimple: Story = {
  parameters: {},
};
