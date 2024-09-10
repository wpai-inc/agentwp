import { useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { useClient } from '@/Providers/ClientProvider';
import { usePage } from '@/Providers/PageProvider';
import { SiteSettingData } from '@/Types/types';

export default function ChatSettings() {
  const {
    page: { account_settings },
  } = usePage();

  const [ settings, setSettings ] = useState< SiteSettingData[] >( account_settings );
  const { updateSetting } = useClient();

  async function handleChange( name: string, checked: boolean ) {
    await updateSetting( name, checked, settings, setSettings );
  }

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto w-full">
      <p>
        These settings will be applied for your user only. If they are disabled, please contact the
        administrator of this account.
      </p>
      { settings.map( setting => (
        <div className="flex items-center space-x-2" key={ setting.name }>
          <Switch
            id={ setting.name }
            checked={ setting.value }
            onCheckedChange={ ( checked: boolean ) => handleChange( setting.name, checked ) }
          />
          <Label htmlFor={ setting.name }>{ setting.label }</Label>
        </div>
      ) ) }
    </div>
  );
}
