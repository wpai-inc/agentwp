import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import IconQuery from '@material-design-icons/svg/outlined/query_stats.svg?react';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'brand',
        'brand-outline',
        'brand-gray',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isBusy: {
      control: { type: 'boolean' },
    },
  },
};

export const DefaultButton: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
    size: 'default',
    isBusy: false,
  },
};

export const DestructiveButton: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
    size: 'default',
    isBusy: false,
  },
};

export const OutlineButton: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    size: 'default',
    isBusy: false,
  },
};

export const SecondaryButton: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'default',
    isBusy: false,
  },
};

export const GhostButton: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'default',
    isBusy: false,
  },
};

export const LinkButton: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
    size: 'default',
    isBusy: false,
  },
};

export const BrandButton: Story = {
  args: {
    children: 'Brand Button',
    variant: 'brand',
    size: 'default',
    isBusy: false,
  },
};

export const BrandOutlineButton: Story = {
  args: {
    children: 'Brand Outline Button',
    variant: 'brand-outline',
    size: 'default',
    isBusy: false,
  },
};

export const BrandGrayButton: Story = {
  args: {
    children: 'Brand Gray Button',
    variant: 'brand-gray',
    size: 'default',
    isBusy: false,
  },
};

export const SmallButton: Story = {
  args: {
    children: 'Small Button',
    variant: 'default',
    size: 'sm',
    isBusy: false,
  },
};

export const LargeButton: Story = {
  args: {
    children: 'Large Button',
    variant: 'default',
    size: 'lg',
    isBusy: false,
  },
};

export const IconButton: Story = {
  args: {
    children: <IconQuery />,
    variant: 'default',
    size: 'icon',
    isBusy: false,
  },
};

export const BusyButton: Story = {
  args: {
    children: 'Busy Button',
    variant: 'default',
    size: 'default',
    isBusy: true,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;
