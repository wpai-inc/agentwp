import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './badge';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Badge> = {
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const BadgeStory: Story = {
  args: {
    children: 'Badge Default',
    variant: 'default',
  },
};
