import ConnectAiService from './Wizard/ConnectAiService';
import CheckedText from '@/Icon/CheckedText';
import { useEffect, useState } from 'react';
import UserAccess from '@/Page/Admin/Settings/Wizard/UserAccess';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function Wizard() {
  const { page } = usePage();
  const { adminRequest } = useRestRequest();

  const [ steps, setSteps ] = useState( [
    {
      text: 'Install Plugin',
      checked: true,
      active: false,
    },
    {
      text: 'Connect AI',
      checked: false,
      active: true,
    },
    {
      text: 'User Access',
      checked: false,
      active: false,
    },
  ] );

  function isConnected() {
    return !! page.access_token;
  }

  function goToAboutPage() {
    adminRequest.post( `onboarding_completed` ).then( () => {
      document.location.reload();
    } );
  }

  useEffect( () => {
    if ( isConnected() ) {
      setSteps( [
        {
          text: 'Install Plugin',
          checked: true,
          active: false,
        },
        {
          text: 'Connect AI',
          checked: true,
          active: false,
        },
        {
          text: 'User Access',
          checked: false,
          active: true,
        },
      ] );
    }
  }, [] );

  return (
    <div>
      <div className="flex justify-center items-center gap-4 mt-8">
        { steps.map( ( step, index ) => (
          <CheckedText
            key={ index }
            active={ step.active }
            checked={ step.checked }
            text={ step.text }
          />
        ) ) }
      </div>
      { steps[ 1 ].active && <ConnectAiService /> }
      { steps[ 2 ].active && <UserAccess onGoToAboutPage={ () => goToAboutPage() } /> }
    </div>
  );
}
