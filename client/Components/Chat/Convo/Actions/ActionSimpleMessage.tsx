import MD from '@/Components/MD';
import { AgentAction } from '@/Providers/UserRequestsProvider';

export default function ActionSimpleMessage({ action }: AgentAction) {
  return <MD content={(action?.text ?? 'something went wrong').toString()} />;
}
