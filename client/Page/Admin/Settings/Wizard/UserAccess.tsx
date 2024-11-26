import { Button } from '@/Components/ui/button';
import UsersManagement from '@/Page/Admin/Settings/SubPages/UsersManagement';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { useTranslation } from 'react-i18next';

export default function UserAccess() {
  const { t } = useTranslation();
  const { restReq } = useRestRequest();
  function goToAboutPage() {
    restReq.post( `onboarding_completed` ).then( () => {
      document.location.reload();
    } );
  }

  return (
    <WizardContainer className="space-y-4">
      <WizardHeader message={ t( 'Choose Who Can Use AgentWP' ) } />
      <UsersManagement />
      <Button variant="brand" size="lg" className="w-full" onClick={ () => goToAboutPage() }>
        { t( 'Continue' ) }
      </Button>
    </WizardContainer>
  );
}
