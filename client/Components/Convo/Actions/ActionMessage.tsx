import type { AgentAction } from '@/Providers/UserRequestsProvider';
import RichMessage from '@/Components/Convo/Actions/RichMessage';

export default function ActionMessage(props: AgentAction) {
  return (
    <div>
      <RichMessage {...props} />
    </div>
  );
}
