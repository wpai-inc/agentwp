import { Button } from '@/Components/ui/button';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';
import { usePage } from '@/Providers/PageProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';

type PlanType = {
  primary: boolean;
  name: string;
  price: string;
  features: React.ReactNode[];
  buttonText: string;
  buttonAction: () => void;
};

export default function ChoosePlan() {
  const { page } = usePage();
  const { updateSetting } = useClientSettings();

  const plans: PlanType[] = [
    {
      primary: false,
      name: 'Free Plan',
      price: '0.00/month',
      features: [ 'Lower limits', 'Less accurate AI', 'Slower responses', '1 user per website' ],
      buttonText: 'Continue on Free',
      buttonAction: () => {
        updateSetting( 'planSelected', true );
      },
    },
    {
      primary: true,
      name: 'Supporter Plan',
      price: '11.99/month',
      features: [
        <>
          Unlimited usage <abbr title="by Unlimited we mean...">*</abbr>
        </>,
        'More accurate AI',
        'Faster responses',
        '5 users per website',
        <strong className="italic">Priority access to agent features as they're released</strong>,
      ],
      buttonText: 'Upgrade this Site to Pro',
      buttonAction: () => {
        updateSetting( 'planSelected', true );
        window.location.href = page.account.upgrade_link;
      },
    },
  ];

  return (
    <WizardContainer className="space-y-6">
      <WizardHeader>You've successfully connected to AI Services</WizardHeader>
      <p className="text-xl text-center text-brand-gray-70">
        Choose a site specific plan to get started:
      </p>
      <div className="grid grid-cols-2 gap-4">
        { plans.map( ( plan, i ) => (
          <PlanCard key={ i } { ...plan } />
        ) ) }
      </div>
    </WizardContainer>
  );
}

function PlanCard( { name, features, buttonText, price, buttonAction, primary }: PlanType ) {
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col">
      <div className="space-y-6 mb-6">
        <h2 className="text-2xl font-bold">{ name }</h2>
        <p className="text-xl text-brand-dark/50 font-semibold">{ price }</p>
        <ul className="space-y-2">
          { features.map( ( feature, i ) => (
            <li key={ i }>{ feature }</li>
          ) ) }
        </ul>
      </div>
      <Button
        variant={ primary ? 'brand' : 'default' }
        size="lg"
        className="mt-auto"
        onClick={ buttonAction }>
        { buttonText }
      </Button>
    </div>
  );
}
