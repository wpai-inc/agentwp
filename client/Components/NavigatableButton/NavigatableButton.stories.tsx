import type { Meta, StoryObj } from '@storybook/react';

import NavigatableButton from './NavigatableButton';

const meta: Meta< typeof NavigatableButton > = {
  title: 'Wpai/NavigatableButton',
  component: NavigatableButton,
};

export default meta;
type Story = StoryObj< typeof meta >;

export const Primary: Story = {
  args: {
    text: 'Primary',
    link: '#',
    styleType: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary',
    link: '#',
    styleType: 'secondary',
  },
};
