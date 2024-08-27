import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconMap from '@material-design-icons/svg/outlined/map.svg?react';

export default function ActionNavigate( { hasExecuted, action }: AgentAction ) {
  let icon = null;
  let title = 'Navigating to ' + action.url;

  if ( hasExecuted ) {
    icon = <IconMap />;
    title = 'Navigated to ' + action.url;
  }

  return <ActionContainer icon={ icon } title={ title } pending={ ! hasExecuted } />;
}
