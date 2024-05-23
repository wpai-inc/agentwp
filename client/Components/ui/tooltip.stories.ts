import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from "@/Components/ui/tooltip";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  argTypes: {}
};

export const Default: Story = {

};

export default meta;
type Story = StoryObj<typeof Tooltip>;
