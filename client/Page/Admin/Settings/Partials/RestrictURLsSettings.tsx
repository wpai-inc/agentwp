import { useState } from 'react';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { Button } from '@/Components/ui/button';
import { usePage } from '@/Providers/PageProvider';
import { DataListItem } from '@/Components/ui/dl';
import { useTranslation } from 'react-i18next';

export default function RestrictURLsSettings() {
  const { t } = useTranslation();
  const { tryRequest } = useRestRequest();
  const { page } = usePage();
  const [ urls, setUrls ] = useState( page.general_settings?.restricted_urls );

  async function updateSetting( key: string, newValue: any ) {
    const old_general_settings = page.general_settings;
    const new_general_settings = { ...old_general_settings, [ key ]: newValue };
    await tryRequest(
      'post',
      'update_general_settings',
      new_general_settings,
      () => setUrls( newValue ),
      () => setUrls( old_general_settings.restricted_urls ),
    );
  }

  return (
    <DataListItem
      label={
        <div>
          <label className="font-bold">{ t( 'Restricted URLs and Patterns' ) }</label>
          <p className="text-sm">
            { t(
              'Chat will not be available on these URLs or URL patterns. Put each on a new line.',
            ) }{ ' ' }
            <a
              className="text-blue-500 hover:underline cursor-pointer underline"
              href="https://agentwp.com/kb/restricted-url-patterns"
              target="_blank"
              rel="noreferrer">
              { t( 'Read more about URL patterns.' ) }
            </a>
          </p>
        </div>
      }>
      <textarea
        className="border border-gray-300 rounded w-full p-2"
        rows={ 5 }
        value={ urls }
        onChange={ e => setUrls( e.target.value ) }></textarea>
      <Button
        variant="brand"
        className="mt-2"
        onClick={ () => updateSetting( 'restricted_urls', urls ) }>
        { t( 'Save' ) }
      </Button>
    </DataListItem>
  );
}
