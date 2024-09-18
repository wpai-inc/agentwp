import { useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';
import { DataListItem } from '@/Components/ui/dl';
export default function ChatSettings() {
  const {
    page: { account_settings },
  } = usePage();

  const [ settings, setSettings ] = useState< App.Data.SiteSettingData[] >( account_settings );
  const { apiRequest } = useRestRequest();

  async function handleChange( name: App.Enums.SiteSettingValue, checked: boolean ) {
    const prevSettings = settings;

    const updatedSettings = settings.map( setting =>
      name === setting.name ? { ...setting, value: checked } : setting,
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
    <>
      { settings.map( setting => (
        <DataListItem key={ setting.name } label={ setting.label }>
          <Switch
            id={ setting.name }
            checked={ setting.value }
            onCheckedChange={ ( checked: boolean ) => handleChange( setting.name, checked ) }
          />
        </DataListItem>
      ) ) }
    </>
  );
}
