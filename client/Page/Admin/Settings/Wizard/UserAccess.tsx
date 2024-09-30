import { Button } from '@/Components/ui/button';
import UsersManagement from '@/Page/Admin/Settings/SubPages/UsersManagement';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function UserAccess() {
  const { restReq } = useRestRequest();
  function goToAboutPage() {
    restReq.post( `onboarding_completed` ).then( () => {
      document.location.reload();
    } );
  }

  return (
    <WizardContainer className="space-y-4">
      <WizardHeader>Choose Who Can Use AgentWP</WizardHeader>
      <UsersManagement />
      <Button variant="brand" size="lg" className="w-full" onClick={ () => goToAboutPage() }>
        Continue
      </Button>
    </WizardContainer>
  );
}
