import type { Meta, StoryObj } from '@storybook/react';

import ChatOverlay from './ChatOverlay';

const meta: Meta<typeof ChatOverlay> = {
  component: ChatOverlay,
};

export default meta;
type Story = StoryObj<typeof ChatOverlay>;

export const ChatOverlaySImple: Story = {
  parameters: {},
};
