import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconEdit from '@material-design-icons/svg/outlined/edit.svg?react';

export default function ActionWriteToInputField( { hasExecuted, action }: AgentAction ) {
  return (
    <ActionContainer pending={ ! hasExecuted } icon={ <IconEdit /> }>
      Input field updated
    </ActionContainer>
  );
}
