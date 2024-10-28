import { useActionListener } from '@/Providers/ActionListenerProvider';
import ActionContainer from './ActionContainer';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import IconMap from '@material-design-icons/svg/outlined/map.svg?react';
import { Button } from '@/Components/ui/button';
import { usePage } from '@/Providers/PageProvider';
import { NavigateAction } from '@wpai/schemas';

export default function ActionNavigate( aa: AgentAction ) {
  const { actionNavigation } = useActionListener();
  const { page } = usePage();
  const action = aa.action as NavigateAction;

  const relativeUrl = action.url.replace( page.home_url, '' );
  let title = 'Suggesting navigation to ' + relativeUrl;

  if ( aa.hasExecuted ) {
    if ( aa.hasError ) {
      title = 'Cancelled navigation to ' + relativeUrl;
    } else {
      title = 'Navigated to ' + relativeUrl;
    }
  }

  function NavigationConfirmation() {
    return (
      <p>
        Would you like to continue to <code>{ relativeUrl }</code>?
        <div className="flex gap-1 items-center justify-end mt-3">
          <Button variant="brand" onClick={ () => actionNavigation( aa, true ) }>
            Continue
          </Button>
          <Button variant="destructive" onClick={ () => actionNavigation( aa, false ) }>
            No
          </Button>
        </div>
      </p>
    );
  }

  return (
    <ActionContainer
      icon={ <IconMap /> }
      title={ title }
      pending={ ! aa.hasExecuted }
      error={ aa.result?.error }>
      { ! aa.hasExecuted ? <NavigationConfirmation /> : title }
    </ActionContainer>
  );
}
