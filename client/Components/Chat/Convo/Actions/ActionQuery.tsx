import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconQuery from '@material-design-icons/svg/outlined/query_stats.svg?react';

export default function ActionQuery( { hasExecuted, action, result }: AgentAction ) {
  let icon = null;
  let title = 'Running SQL query ';

  if ( hasExecuted ) {
    icon = <IconQuery />;
    title = 'Ran SQL query';
  }

  return (
    <ActionContainer icon={ icon } title={ title } pending={ ! hasExecuted } error={ result.error }>
      <code>{ action.sql as string }</code>
    </ActionContainer>
  );
}
