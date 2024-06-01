import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconQuery from '@material-design-icons/svg/outlined/query_stats.svg?react';

export default function ActionQuery( { hasExecuted, action }: AgentAction ) {
  return (
    <ActionContainer pending={ ! hasExecuted } icon={ <IconQuery /> }>
      Ran query <code>{ action.sql as string }</code>
    </ActionContainer>
  );
}
