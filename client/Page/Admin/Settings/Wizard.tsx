import ConnectAiService from './Wizard/ConnectAiService';
import UserAccess from '@/Page/Admin/Settings/Wizard/UserAccess';
import { usePage } from '@/Providers/PageProvider';
import type { SettingsPageData } from '@/Types/types';
import ChoosePlan from './Wizard/ChoosePlan';
import Breadcrumb from './Wizard/Breadcrumb';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

export type StepType = {
  text: string;
  subpage?: React.ReactNode;
};

const steps: StepType[] = [
  {
    text: 'Install',
    subpage: undefined,
  },
  {
    text: 'Connect',
    subpage: <ConnectAiService />,
  },
  {
    text: 'Plan',
    subpage: <ChoosePlan />,
  },
  {
    text: 'Access',
    subpage: <UserAccess />,
  },
];

export default function Wizard() {
  const { page } = usePage< SettingsPageData >();
  const { settings } = useClientSettings();

  const currentStep = () => {
    if ( ! page.is_connected ) {
      return 1;
    }

    if ( settings.planSelected && ! page.onboarding_completed ) return 3;

    return 2;
  };

  return (
    <>
      <Breadcrumb currentStep={ currentStep() } steps={ steps } />
      { steps[ currentStep() ].subpage }
    </>
  );
}
