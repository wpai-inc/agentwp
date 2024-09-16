import { useState } from 'react';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { Switch } from '@/Components/ui/switch';
import { usePage } from '@/Providers/PageProvider';
import { DataListItem } from '@/Components/ui/dl';

export default function GeneralSettings() {
  const { tryRequest } = useRestRequest();
  const { page } = usePage();
  const [ generalSettings, setGeneralSettings ] = useState( page.general_settings );

  async function updateSetting( key: string, newValue: any ) {
    const old_general_settings = generalSettings;
    const new_general_settings = { ...old_general_settings, [ key ]: newValue };
    await tryRequest(
      'post',
      'update_general_settings',
      new_general_settings,
      () => setGeneralSettings( new_general_settings ),
      () => setGeneralSettings( old_general_settings ),
    );
  }

  return (
    <DataListItem label={ <label>Clean up agentwp plugin data after deactivation</label> }>
      <Switch
        id="cleanup_after_deactivate"
        checked={ generalSettings?.cleanup_after_deactivate }
        onCheckedChange={ ( checked: boolean ) =>
          updateSetting( 'cleanup_after_deactivate', checked )
        }
      />
    </DataListItem>
  );
}
