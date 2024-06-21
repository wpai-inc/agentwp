import CodeableEscalation from './CodeableEscalation';
import { MessageAction } from '@wpai/schemas';
import { EscalationProvider } from '@/Providers/EscalationProvider';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta< typeof CodeableEscalation > = {
  title: 'Wpai/Escalations/CodeableEscalation',
  component: CodeableEscalation,
  decorators: [
    ( Story, context ) => (
      <EscalationProvider escalation={ context.args.escalation }>
        <Story />
      </EscalationProvider>
    ),
  ],
};

export default meta;

export const CodeableEscalationStory: StoryObj< typeof CodeableEscalation > = {
  args: {
    escalation: {
      service: 'codeable',
      id: '9c0b2f24-516a-470f-9ac4-b09659f3db0c',
      name: 'Ticket #1235231',
      headline: 'Extend WPForms and Connect to LearnDash',
      description:
        'James would like to build a full integration for users to submit new LearnDash courses via WPForms.',
    },
  } as MessageAction,
};
