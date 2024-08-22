import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconEdit from '@material-design-icons/svg/outlined/edit.svg?react';

export default function ActionWriteToEditor( { hasExecuted }: AgentAction ) {
  return (
    <ActionContainer pending={ ! hasExecuted } icon={ <IconEdit /> }>
      Content updated
    </ActionContainer>
  );
}
