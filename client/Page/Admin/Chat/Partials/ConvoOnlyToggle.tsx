import { ChatSwitch } from '@/Components/Chat/Partials/ChatSwitch';
import { useState } from 'react';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';

export default function ConvoOnlyToggle() {
  const { getAccountSetting } = usePage();
  const setting = getAccountSetting( 'convoOnly' );
  const [ enabled, setEnabled ] = useState( setting?.value || false );

  const { proxyApiRequest } = useRestRequest();

  async function handleChange( checked: boolean ) {
    const updatedSetting = { ...setting, value: checked };
    optimistic(
      async () =>
        await proxyApiRequest< App.Data.SiteSettingData[] >( 'siteSettingSave', updatedSetting ),
      () => setEnabled( checked ),
      () => setEnabled( ! checked ),
    );
  }

  return (
    <label className="flex items-center gap-1.5">
      <ChatSwitch checked={ enabled } onCheckedChange={ handleChange } />
      Convo Only
    </label>
  );
}
