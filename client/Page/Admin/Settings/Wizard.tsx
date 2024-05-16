import ConnectAiService from './Wizard/ConnectAiService';
import CheckedText from '@/Icon/CheckedText';
import { useEffect, useState } from 'react';
import UserAccess from '@/Page/Admin/Settings/Wizard/UserAccess';
import { usePage } from '@/Providers/PageProvider';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';

export default function Wizard() {
  const pageData = usePage();
  const adminRequest = useAdminRoute();

  const [steps, setSteps] = useState([
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
  ]);

  function isConnected() {
    return !!pageData.access_token;
  }

  function goToAboutPage() {
    adminRequest.post(`/agentwp/v1/onboarding_completed`).then(() => {
      document.location.reload();
    });
  }

  useEffect(() => {
    if (isConnected()) {
      setSteps(
        steps.map((step, index) => {
          if (index === 1) {
            return {
              ...step,
              checked: true,
              active: false,
            };
          }
          if (index === 2) {
            return {
              ...step,
              checked: false,
              active: true,
            };
          }
          return step;
        }),
      );
    }
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center gap-4 mt-8">
        {steps.map((step, index) => (
          <CheckedText
            key={index}
            active={step.active}
            checked={step.checked}
            text={step.text}
          />
        ))}
      </div>
      {steps[1].active && <ConnectAiService />}
      {steps[2].active && (
        <UserAccess onGoToAboutPage={() => goToAboutPage()} />
      )}
    </div>
  );
}
