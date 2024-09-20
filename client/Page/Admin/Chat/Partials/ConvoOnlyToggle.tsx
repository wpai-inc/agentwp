import { ChatSwitch } from '@/Components/Chat/Partials/ChatSwitch';
import { useState } from 'react';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';

export default function ConvoOnlyToggle() {
  const {
    page: { account_settings },
  } = usePage();
  const isEnabled = account_settings.find( setting => setting.name === 'convoOnly' );
  const [ enabled, setEnabled ] = useState( isEnabled?.value || false );

  const { apiRequest } = useRestRequest();

  async function handleChange( checked: boolean ) {
    const setting: App.Data.SiteSettingData = {
      name: 'convoOnly',
      value: checked,
      label: null,
    };
    optimistic(
      async () => await apiRequest< App.Data.SiteSettingData[] >( 'siteSettingSave', setting ),
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
