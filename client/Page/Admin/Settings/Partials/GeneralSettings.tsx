import { useState } from 'react';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { Switch } from '@/Components/ui/switch';
import { usePage } from '@/Providers/PageProvider';
import { DataListItem } from '@/Components/ui/dl';

export default function GeneralSettings() {
  const adminRequest = useAdminRoute();
  const { page } = usePage();
  const [ generalSettings, setGeneralSettings ] = useState( page.general_settings );

  function updateSetting( key: string, newValue: any ) {
    const new_general_settings = { ...generalSettings, [ key ]: newValue };

    setGeneralSettings( new_general_settings );

    adminRequest
      .post( 'update_general_settings', new_general_settings )
      .then( () => {
        console.log( 'Settings saved' );
      } )
      .catch( ( error: any ) => {
        console.error( error );
      } );
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
