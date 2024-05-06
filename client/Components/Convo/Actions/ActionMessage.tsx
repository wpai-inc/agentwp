import { MessageAction } from '@wpai/schemas';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import RichMessage from '@/Components/RichMessage';

export type MessageAgentAction = Omit<AgentAction, 'action'> & {
  action: MessageAction;
};

export default function ActionMessage(props: MessageAgentAction) {
  return (
    <div>
      <RichMessage action={props} />
    </div>
  );
}
