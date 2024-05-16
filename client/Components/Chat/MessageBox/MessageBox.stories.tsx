import type { Meta, StoryObj } from '@storybook/react';

import MessageBox from './MessageBox';

const meta: Meta<typeof MessageBox> = {
  component: MessageBox,
};

export default meta;
type Story = StoryObj<typeof MessageBox>;

export const MessageBoxStory: Story = {
  parameters: {},
};
