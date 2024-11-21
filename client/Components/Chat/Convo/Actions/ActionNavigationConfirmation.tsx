import type { AgentAction } from '@/Providers/UserRequestsProvider';
import type { NavigateAction } from '@wpai/schemas';
import { Button } from '@/Components/ui/button';
import { useActionListener } from '@/Providers/ActionListenerProvider';
import { usePage } from '@/Providers/PageProvider';
import { useTranslation } from 'react-i18next';

export default function ActionNavigationConfirmation( aa: AgentAction ) {
  const { t } = useTranslation();
  const action = aa.action as NavigateAction;
  const { actionNavigation } = useActionListener();
  const { page } = usePage();
  const relativeUrl = action?.url ? action.url.replace( page.home_url, '' ) : t( 'Not found' );

  return (
    <div className="flex flex-col gap-4">
      <p>
        { t( 'I think we should navigate to a new page. Would you like to continue to:' ) }{ ' ' }
        <code>{ relativeUrl }</code>
      </p>
      <div className="grid grid-cols-2 gap-1">
        <Button variant="outline" onClick={ () => actionNavigation( aa, false ) }>
          { t( 'No' ) }
        </Button>
        <Button variant="outline" onClick={ () => actionNavigation( aa, true ) }>
          { t( 'Yes' ) }
        </Button>
      </div>
    </div>
  );
}
