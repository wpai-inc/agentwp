import { useState } from 'react';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { PageData } from '@/Types/types';
import { Switch } from '@/Components/ui/switch';

declare const agentwp_settings: PageData;

export default function GeneralSettings() {
    const adminRequest = useAdminRoute();
    const [generalSettings, setGeneralSettings] = useState(agentwp_settings.general_settings);

    console.log(generalSettings);

    function updateSetting(key: string, newValue: any) {
        console.log([key, newValue]);
        const new_general_settings = { ...generalSettings, [key]: newValue };

        setGeneralSettings(new_general_settings);

        adminRequest
            .post('update_general_settings', new_general_settings)
            .then(() => {
                console.log('Settings saved');
            })
            .catch((error: any) => {
                console.error(error);
            });
    }

    return (
        <div className=" max-w-[720px] text-base">
            <label className="flex gap-2 items-center">
                <Switch
                    id='cleanup_after_deactivate'
                    checked={ generalSettings?.cleanup_after_deactivate }
                    onCheckedChange={ ( checked: boolean ) => updateSetting( 'cleanup_after_deactivate', checked ) }
                />
                Clean up agentwp plugin data after deactivation
            </label>
        </div>
    );
}
