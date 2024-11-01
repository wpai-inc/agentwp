import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconMap from '@material-design-icons/svg/outlined/map.svg?react';
import { usePage } from '@/Providers/PageProvider';
import { NavigateAction } from '@wpai/schemas';

export default function ActionNavigate( aa: AgentAction ) {
  const { page } = usePage();
  const action = aa.action as NavigateAction;

  const relativeUrl = action?.url ? action.url.replace( page.home_url, '' ) : 'Not found';

  let title = 'Suggesting navigation to ' + relativeUrl;

  if ( aa.hasExecuted ) {
    if ( aa.result?.data?.confirmed !== true ) {
      title = 'Cancelled navigation to ' + relativeUrl;
    } else {
      title = 'Navigated to ' + relativeUrl;
    }
  }

  return (
    <ActionContainer
      icon={ <IconMap /> }
      title={ title }
      pending={ ! aa.hasExecuted }
      error={ aa.result?.error }>
      { title }
    </ActionContainer>
  );
}
