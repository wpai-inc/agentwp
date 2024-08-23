import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconEdit from '@material-design-icons/svg/outlined/edit.svg?react';

export default function ActionWriteToInputField( { hasExecuted }: AgentAction ) {
  let icon = null;
  let title = 'Updating input field';

  if ( hasExecuted ) {
    icon = <IconEdit />;
    title = 'Input field updated';
  }

  return <ActionContainer icon={ icon } title={ title } pending={ ! hasExecuted } />;
}
