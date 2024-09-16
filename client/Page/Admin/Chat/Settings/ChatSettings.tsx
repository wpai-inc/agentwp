import { useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';

export default function ChatSettings() {
  const {
    page: { account_settings },
  } = usePage();

  const [ settings, setSettings ] = useState< App.Data.SiteSettingData[] >( account_settings );
  const { apiRequest } = useRestRequest();

  async function handleChange( name: App.Enums.SiteSettingValue, checked: boolean ) {
    const prevSettings = settings;
    const updatedSettings = settings.map( setting =>
      name === setting.name ? { ...setting, checked } : setting,
    );

    const setting: App.Data.SiteSettingData = {
      name,
      value: checked,
      label: null,
    };

    optimistic(
      async () => await apiRequest< App.Data.SiteSettingData[] >( 'siteSettingSave', setting ),
      () => setSettings( updatedSettings ),
      () => setSettings( prevSettings ),
    );
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
