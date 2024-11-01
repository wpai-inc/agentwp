import type { AgentAction } from '@/Providers/UserRequestsProvider';
import type { NavigateAction } from '@wpai/schemas';
import { Button } from '@/Components/ui/button';
import { useActionListener } from '@/Providers/ActionListenerProvider';
import { usePage } from '@/Providers/PageProvider';

export default function ActionNavigationConfirmation( aa: AgentAction ) {
  const action = aa.action as NavigateAction;
  const { actionNavigation } = useActionListener();
  const { page } = usePage();
  const relativeUrl = action?.url ? action.url.replace( page.home_url, '' ) : 'Not found';

  return (
    <div className="flex flex-col gap-4">
      <p>
        I think we should navigate to a new page. Would you like to continue to:{ ' ' }
        <code>{ relativeUrl }</code>
      </p>
      <div className="grid grid-cols-2 gap-1">
        <Button variant="outline" onClick={ () => actionNavigation( aa, false ) }>
          No
        </Button>
        <Button variant="outline" onClick={ () => actionNavigation( aa, true ) }>
          Yes
        </Button>
      </div>
    </div>
  );
}
