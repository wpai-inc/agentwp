import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconQuery from '@material-design-icons/svg/outlined/query_stats.svg?react';

export default function ActionWriteToEditor( { hasExecuted, action }: AgentAction ) {
  return (
    <ActionContainer pending={ ! hasExecuted } icon={ <IconQuery /> }>
      Content updated { action.ability }...
    </ActionContainer>
  );
}
