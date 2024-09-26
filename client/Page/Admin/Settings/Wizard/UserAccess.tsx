import { Button } from '@/Components/ui/button';
import UsersManagement from '@/Page/Admin/Settings/SubPages/UsersManagement';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';

export default function UserAccess( { onGoToAboutPage }: { onGoToAboutPage: () => void } ) {
  return (
    <WizardContainer className="space-y-4">
      <WizardHeader>Choose Who Can Use AgentWP</WizardHeader>
      <UsersManagement />
      <Button variant="brand" size="lg" className="w-full" onClick={ () => onGoToAboutPage() }>
        Continue
      </Button>
    </WizardContainer>
  );
}
