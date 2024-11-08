import { useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';
import { DataListItem } from '@/Components/ui/dl';

const abilities = [ 'navigate', 'query' ];

export default function ChatSettings() {
  const {
    page: { account_settings },
  } = usePage();

  const [ settings, setSettings ] = useState< App.Data.SiteSettingData[] >( account_settings );
  const { proxyApiRequest } = useRestRequest();
  const isBoolean = ( value: any ) => typeof value === 'boolean';

  async function handleChange( name: App.Enums.SiteSettingValue, checked: boolean ) {
    const prevSettings = settings;

    const updatedSettings = settings.map( setting =>
      name === setting.name ? { ...setting, value: checked } : setting,
    );

    const setting: App.Data.SiteSettingData = {
      name,
      value: checked,
      label: null,
      canUpdate: true,
    };

    optimistic(
      async () => await proxyApiRequest< App.Data.SiteSettingData[] >( 'siteSettingSave', setting ),
      () => setSettings( updatedSettings ),
      () => setSettings( prevSettings ),
    );
  }

  return (
    <>
      { settings.map( setting => (
        <DataListItem
          key={ setting.name }
          label={
            <div>
              <label className="font-bold">{ setting.label }</label>
              { setting.name === 'abilities' && (
                <p className="text-sm">Abilities are the actions AgentWP can take on your site.</p>
              ) }
            </div>
          }>
          { setting.name === 'abilities' ? (
            <div className="space-y-2">
              { abilities.map( ( ability: string ) => (
                <label key={ ability } className="capitalize flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={ setting.value.includes( ability ) }
                    onChange={ ( e: React.ChangeEvent< HTMLInputElement > ) => {
                      const newItems = e.target.checked
                        ? [ ...setting.value, ability ]
                        : setting.value.filter( ( item: string ) => item !== ability );
                      handleChange( setting.name, newItems );
                    } }
                  />
                  { ability }
                </label>
              ) ) }
            </div>
          ) : isBoolean( setting.value ) ? (
            <Switch
              id={ setting.name }
              checked={ setting.value }
              onCheckedChange={ ( checked: boolean ) => handleChange( setting.name, checked ) }
            />
          ) : null }
        </DataListItem>
      ) ) }
    </>
  );
}
