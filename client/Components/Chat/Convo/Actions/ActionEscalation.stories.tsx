import type { Meta, StoryObj } from '@storybook/react';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

import ActionEscalation from './ActionEscalation';

const meta: Meta< typeof ActionEscalation > = {
  title: 'Chat/Convo/Actions/ActionEscalation',
  component: ActionEscalation,
};

export default meta;
type Story = StoryObj< typeof meta >;

let aa = {
  action: {
    escalation: {
      service: 'codeable',
      id: '9c0b2f24-516a-470f-9ac4-b09659f3db0c',
      name: 'Ticket #1235231',
      headline: 'Extend WPForms and Connect to LearnDash',
      description:
        'James would like to build a full integration for users to submit new LearnDash courses via WPForms.',
    },
  },
} as AgentAction;

export const Action: Story = {
  args: { ...aa },
};
