import { useState } from 'react';
import { AgentTooltip } from '@/Components/ui/tooltip';
import IconVision from '@material-design-icons/svg/outlined/visibility.svg?react';
import IconNoVision from '@material-design-icons/svg/outlined/visibility_off.svg?react';
import { cn, optimistic } from '@/lib/utils';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { usePage } from '@/Providers/PageProvider';

export default function ToggleVision() {
  const { getAccountSetting } = usePage();
  const setting = getAccountSetting( 'visionEnabled' );
  const [ on, setOn ] = useState< boolean >( setting?.value || false );

  const { proxyApiRequest } = useRestRequest();
  const msg = on
    ? 'Vision is on. Click to toggle off.'
    : 'Vision is off. When turned on, AgentWP can view the current page.';

  async function toggleVision() {
    const prev = on;
    const updated = ! prev;
    const updatedSetting = { ...setting, value: updated };

    optimistic(
      async () =>
        await proxyApiRequest< App.Data.SiteSettingData[] >( 'siteSettingSave', updatedSetting ),
      () => setOn( updated ),
      () => setOn( prev ),
    );
  }

  return (
    <AgentTooltip content={ <p className="max-w-60">{ msg }</p> }>
      <button
        type="button"
        onClick={ toggleVision }
        className={ cn( 'text-brand-gray-70/50 hover:text-brand-primary', {
          'text-brand-primary': on,
        } ) }>
        { on ? <IconVision className="w-5 h-5" /> : <IconNoVision className="w-5 h-5" /> }
      </button>
    </AgentTooltip>
  );
}
