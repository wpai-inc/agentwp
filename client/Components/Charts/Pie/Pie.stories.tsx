import type { Meta, StoryObj } from '@storybook/react';

import Pie from './Pie';

export default {
  title: 'Wpai/Charts/Pie',
  component: Pie,
}

export const Simple = {
  args: {
    dataKey: 'label',
    valueDataKey: 'value',
    outerRadius: 80,
    data: [
      { label: 'Agriculture', value: 150 },
      { label: 'Energy', value: 170 },
      { label: 'Finance', value: 200 },
      { label: 'Manufacturing', value: 300 },
    ]
  },
};
