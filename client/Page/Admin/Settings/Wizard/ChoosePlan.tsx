import { Button } from '@/Components/ui/button';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';
import { usePage } from '@/Providers/PageProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { SettingsPageData } from '@/Types/types';
import { useAccount } from '@/Providers/AccountProvider';

type PlanType = {
  primary: boolean;
  name: string;
  price: string;
  features: React.ReactNode[];
  buttonText: string;
  buttonAction: () => void;
};

export default function ChoosePlan() {
  const { page } = usePage< SettingsPageData >();
  const { account } = useAccount();
  const { updateSetting } = useClientSettings();

  function getPlan( slug: string ) {
    return page.plans.find( plan => plan.slug === slug ) as App.Data.PlanData;
  }

  //const freePlan = getPlan( 'free' );
  const proPlan = getPlan( 'pro' );

  const money = new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  } );

  const plans: PlanType[] = [
    {
      primary: true,
      name: 'Supporter Plan',
      price: `${ money.format( proPlan.priceMonthly ) }/month`,
      features: [
        <FeatureUnlimited />,
        'More accurate AI',
        'Faster responses',
        '5 users per website',
        <strong className="italic">Priority access to agent features as they're released</strong>,
      ],
      buttonText: 'Upgrade this Site to Pro',
      buttonAction: () => {
        updateSetting( 'planSelected', true );
        if ( account ) {
          window.location.href = account.upgrade_link;
        }
      },
    },
    {
      primary: false,
      name: 'Free Plan',
      price: '',
      features: [ 'Lower limits & slower AI' ],
      buttonText: 'Continue on Free',
      buttonAction: () => {
        updateSetting( 'planSelected', true );
      },
    },
  ];

  return (
    <WizardContainer className="space-y-6">
      <WizardHeader message="You've successfully connected to AI Services"></WizardHeader>
      <p className="text-left text-xl text-brand-gray-70">
        Choose a site specific plan to get started:
      </p>
      <div className="space-y-4">
        { plans.map( ( plan, i ) => (
          <PlanCard key={ i } { ...plan } />
        ) ) }
      </div>
    </WizardContainer>
  );
}

function FeatureUnlimited() {
  return (
    <AgentTooltip
      content={ () => (
        <p>
          Subject to our{ ' ' }
          <a href="https://agentwp.com/legal/terms/" className="underline underline-offset-1">
            fair use policy
          </a>
          .
        </p>
      ) }>
      <p>Unlimited usage *</p>
    </AgentTooltip>
  );
}

function PlanCard( { name, features, buttonText, price, buttonAction, primary }: PlanType ) {
  return (
    <div className={ `rounded-lg p-6 ${ primary ? 'bg-gray-100' : 'border border-gray-100' }` }>
      <div className="mb-6 space-y-6">
        <h2 className="text-2xl font-bold">{ name }</h2>
        { price && <p className="text-xl font-semibold text-brand-dark/50">{ price }</p> }
        <ul className="space-y-2">
          { features.map( ( feature, i ) => (
            <li key={ i }>{ feature }</li>
          ) ) }
        </ul>
      </div>
      { primary ? (
        <Button variant="brand" size="lg" className="w-full" onClick={ buttonAction }>
          { buttonText }
        </Button>
      ) : (
        <Button
          variant="outline"
          size="lg"
          className="w-full text-gray-500"
          onClick={ buttonAction }>
          Or, continue with free
        </Button>
      ) }
    </div>
  );
}
