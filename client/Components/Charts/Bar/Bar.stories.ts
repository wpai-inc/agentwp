import type { Meta, StoryObj } from '@storybook/react';

import Bar from './Bar';

export default {
  title: 'Wpai/Charts/Bar',
  component: Bar,
};

export const Simple = {
  args: {
    xDataKey: 'label',
    valueDataKey: 'value',
    data: [
      { label: 'Honduras', value: 40 },
      { label: 'Romania', value: 80 },
      { label: 'Brasil', value: 20 },
      { label: 'United States', value: 40 },
    ]
  },
};
