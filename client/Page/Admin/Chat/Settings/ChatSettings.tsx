import { useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { useClient } from '@/Providers/ClientProvider';
import { usePage } from '@/Providers/PageProvider';
import type { AccountSetting } from '@/Types/types';

export type Setting = {
  name: string;
  label: string;
  value: any;
};

const defaultSettings: Setting[] = [
  {
    name: 'webEnabled',
    label: 'Web Enabled',
    value: false,
  },
  {
    name: 'screenshotsEnabled',
    label: 'Vision Enabled',
    value: false,
  },
];

export default function ChatSettings() {
  const {
    page: { account_settings },
  } = usePage();

  const initSettings: Setting[] = defaultSettings.map( setting => {
    const accountSetting = account_settings.find(
      ( s: AccountSetting ) => s.name === setting.name,
    );
    if ( accountSetting ) {
      return { ...setting, value: accountSetting.value };
    }
    return setting;
  } );

  const [ settings, setSettings ] = useState< Setting[] >( initSettings );
  const { updateSetting } = useClient();

  async function handleChange( name: string, checked: boolean ) {
    await updateSetting( name, checked, settings, setSettings );
  }

  const settingLabel = ( name: string ) => {
    return defaultSettings.find( setting => setting.name === name )?.label;
  };

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
          <Label htmlFor={ setting.name }>{ settingLabel( setting.name ) }</Label>
        </div>
      ) ) }
    </div>
  );
}
