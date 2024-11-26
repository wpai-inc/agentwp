import { Button } from '@/Components/ui/button';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';
import { usePage } from '@/Providers/PageProvider';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { SettingsPageData } from '@/Types/types';
import { useAccount } from '@/Providers/AccountProvider';
import { useTranslation } from 'react-i18next';

type ProPlanType = {
  name: string;
  price: string;
  features: React.ReactNode[];
  buttonText: string;
  buttonAction: () => void;
};

export default function ChoosePlan() {
  const { t } = useTranslation();
  const { page } = usePage< SettingsPageData >();
  const { account } = useAccount();
  const { updateSetting } = useClientSettings();

  function getPlan( slug: string ) {
    return page.plans.find( plan => plan.slug === slug ) as App.Data.PlanData;
  }

  const proPlan = getPlan( 'pro' );

  const money = new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  } );

  const proPlanData: ProPlanType = {
    name: t( 'Supporter Plan' ),
    price: `${ money.format( proPlan.priceMonthly ) }/month`,
    features: [
      <FeatureUnlimited />,
      t( 'More accurate AI' ),
      t( 'Faster responses' ),
      t( '5 users per website' ),
      <strong className="italic">
        { t( "Priority access to agent features as they're released" ) }
      </strong>,
    ],
    buttonText: t( 'Upgrade this Site to Pro' ),
    buttonAction: () => {
      updateSetting( 'planSelected', true );
      if ( account ) {
        window.location.href = account.upgrade_link;
      }
    },
  };

  const handleFreePlan = () => {
    updateSetting( 'planSelected', true );
  };

  return (
    <WizardContainer className="space-y-6">
      <WizardHeader message={ t( "You've successfully connected to AI Services" ) }></WizardHeader>
      <p className="text-left text-xl text-brand-gray-70">
        { t( 'Choose a site specific plan to get started:' ) }
      </p>
      <div className="space-y-4">
        <PlanCard { ...proPlanData } />
        <Button
          variant="ghost"
          size="lg"
          className="w-full text-gray-500 bg-gray-100"
          onClick={ handleFreePlan }>
          { t( 'Or, continue with free' ) }
        </Button>
      </div>
    </WizardContainer>
  );
}

function FeatureUnlimited() {
  const { t } = useTranslation();

  return (
    <AgentTooltip
      content={
        <p>
          { t( 'Subject to our' ) }{ ' ' }
          <a href="https://agentwp.com/legal/terms/" className="underline underline-offset-1">
            { t( 'fair use policy' ) }
          </a>
          .
        </p>
      }>
      <p>{ t( 'Unlimited usage' ) } *</p>
    </AgentTooltip>
  );
}

function PlanCard( { name, features, buttonText, price, buttonAction }: ProPlanType ) {
  return (
    <div className="rounded-lg p-6 bg-gray-100">
      <div className="mb-6 space-y-6">
        <h2 className="text-2xl font-bold">{ name }</h2>
        { price && <p className="text-xl font-semibold text-brand-dark/50">{ price }</p> }
        <ul className="space-y-2">
          { features.map( ( feature, i ) => (
            <li key={ i }>{ feature }</li>
          ) ) }
        </ul>
      </div>
      <Button variant="brand" size="lg" className="w-full" onClick={ buttonAction }>
        { buttonText }
      </Button>
    </div>
  );
}
