import { MessageAction } from '@wpai/schemas';
import MD from '@/Components/MD';
import type { AgentAction } from '@/Providers/UserRequestsProvider';

export type MessageAgentAction = Omit<AgentAction, 'action'> & {
  action: MessageAction;
};

export default function ActionMessage({ action }: MessageAgentAction) {
  return (
    <div className="border-b border-gray-300 py-2">
      <MD>{action?.text ?? 'something went wrong'}</MD>
    </div>
  );
}
