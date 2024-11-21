import { useState } from 'react';
import ConnectButton from '@/Page/Admin/Settings/Partials/ConnectButton';
import { ManualAwpActivation } from '@/Page/Admin/Settings/Partials/ManualAwpActivation';
import { usePage } from '@/Providers/PageProvider';
import { SettingsPageData } from '@/Types/types';
import WizardHeader from '../Partials/WizardHeader';
import WizardContainer from '../Partials/WizardContainer';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { useTranslation } from 'react-i18next';

export default function ConnectAiService() {
  const { t } = useTranslation();
  const { page } = usePage< SettingsPageData >();
  const [ accepted, setAccepted ] = useState( false );
  const [ isManualMode, setIsManualMode ] = useState( false );
  const { tryRequest } = useRestRequest();

  async function handleAccept() {
    const is_accepted = ! accepted;

    try {
      await optimistic(
        async () => {
          if ( is_accepted ) {
            await tryRequest( 'post', 'accept_terms', {
              accepted: ! accepted,
            } );
          }
        },
        () => {
          setAccepted( is_accepted );
        },
        msg => {
          throw new Error( msg );
        },
      );
    } catch ( error ) {}
  }

  return (
    <WizardContainer>
      <WizardHeader
        siteIcon={ page.site_icon_url }
        message={ `${ t( 'Connect' ) } ${ page.site_title } ${ t( 'Site to AgentWP Services' ) }` }
      />
      <div className="text-brand-gray-70 -mb-4">
        <p className="text-lg mt-4">
          { t(
            'To begin using AgentWP, connect it to the Al services. If this is your first time connecting this site, a quick indexing process will take place.',
          ) }
        </p>
        <div className="mt-4 rounded-lg bg-gray-100 p-6 text-base">
          <h3 className="text-left">{ t( 'AgentWP will have access to:' ) }</h3>
          <ul className="mt-4 space-y-4 list-disc pl-5">
            <li title={ t( 'Active plugins & themes, uploads, and logs' ) }>/wp-content/</li>
            <li title={ t( 'Database structure, database content (encrypted)' ) }>
              { t( 'Database' ) }
            </li>
            <li>{ t( 'Site Health' ) }</li>
          </ul>
        </div>
        <p className="mt-4 italic">
          { t(
            'Your data is private. It will never be used for AI training, and is encrypted at rest and transit.',
          ) }
        </p>
        <div className="mt-4">
          <label className="mb-4 flex gap-1 items-center">
            <input
              type="checkbox"
              checked={ accepted }
              onChange={ handleAccept }
              className="mr-2 border border-grey-100 shadow-none focus:ring-2 focus:ring-brand-primary-muted/70 active:ring-2 active:ring-brand-primary-muted/70"
            />{ ' ' }
            { t( 'I agree to the' ) }{ ' ' }
            <a href="https://agentwp.com/legal/terms/" target="_blank" className="underline">
              { t( 'Terms' ) }
            </a>
            { t( 'and' ) }
            <a href="https://agentwp.com/legal/privacy/" target="_blank" className="underline">
              { t( 'Privacy Policy' ) }
            </a>
          </label>
          { ! isManualMode &&
            ( accepted ? (
              <ConnectButton accepted={ accepted } />
            ) : (
              <AgentTooltip content={ t( 'Please accept the terms and conditions' ) }>
                <div>
                  <ConnectButton accepted={ accepted } className="cursor-not-allowed" />
                </div>
              </AgentTooltip>
            ) ) }
          <ManualAwpActivation
            accepted={ accepted }
            onToggleManual={ isManual => setIsManualMode( isManual ) }
          />
        </div>
      </div>
    </WizardContainer>
  );
}
