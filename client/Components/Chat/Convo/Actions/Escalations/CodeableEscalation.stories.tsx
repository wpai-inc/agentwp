import CodeableEscalation from './CodeableEscalation';
import { MessageAction } from '@wpai/schemas';

export default {
  title: 'Wpai/Escalations/CodeableEscalation',
  component: CodeableEscalation,
};

export const CodeableEscalationStory = {
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
