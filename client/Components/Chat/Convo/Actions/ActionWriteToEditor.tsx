import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconEdit from '@material-design-icons/svg/outlined/edit.svg?react';

export default function ActionWriteToEditor( { hasExecuted }: AgentAction ) {
  let icon = null;
  let title = 'Updating content';

  if ( hasExecuted ) {
    icon = <IconEdit />;
    title = 'Content updated';
  }

  return <ActionContainer icon={ icon } title={ title } pending={ ! hasExecuted } />;
}
