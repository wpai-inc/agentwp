import { MessageAction } from '@wpai/schemas';
import MD from '@/Components/MD';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

export type MessageAgentAction = Omit<AgentAction, 'action'> & {
  action: MessageAction;
};

export default function ActionMessage({ action }: MessageAgentAction) {
  return <MD>{action?.text ?? 'something went wrong'}</MD>;
}
