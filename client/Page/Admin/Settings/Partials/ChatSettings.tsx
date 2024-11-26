import { useState } from 'react';
import { Switch } from '@/Components/ui/switch';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';
import { DataListItem } from '@/Components/ui/dl';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

type AbilitySetting = { name: string; label: string };
const abilities: AbilitySetting[] = [
  {
    name: 'navigate',
    label: i18n.t( 'Navigate' ),
  },
  {
    name: 'query',
    label: i18n.t( 'Query - Read Only' ),
  },
];

export default function ChatSettings() {
  const {
    page: { account_settings },
  } = usePage();

  const { t } = useTranslation();
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
                <p className="text-sm">
                  { t( 'Abilities are the actions AgentWP can take on your site.' ) }
                </p>
              ) }
            </div>
          }>
          { setting.name === 'abilities' ? (
            <div className="space-y-2">
              { abilities.map( ability => (
                <label key={ ability.name } className="capitalize flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={ setting.value.includes( ability.name ) }
                    onChange={ ( e: React.ChangeEvent< HTMLInputElement > ) => {
                      const newItems = e.target.checked
                        ? [ ...setting.value, ability.name ]
                        : setting.value.filter( ( item: string ) => item !== ability.name );
                      handleChange( setting.name, newItems );
                    } }
                  />
                  { ability.label }
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
