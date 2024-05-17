import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconQuery from '@material-design-icons/svg/outlined/query_stats.svg?react';

export default function ActionQuery(props: AgentAction) {
  return (
    <ActionContainer pending={!props.result} icon={<IconQuery />}>
      Ran query <code>{props.action.sql}</code>
    </ActionContainer>
  );
}
