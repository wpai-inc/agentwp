import { ChatSwitch } from '@/Components/Chat/Partials/ChatSwitch';
import { useState } from 'react';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { optimistic } from '@/lib/utils';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { useAccountSettings } from '@/Providers/AccountSettingsProvider';

export default function ConvoOnlyToggle() {
  const { getAccountSetting, updateSetting } = useAccountSettings();
  const setting = getAccountSetting( 'convoOnly' );
  const [ enabled, setEnabled ] = useState( setting?.value || false );

  const { proxyApiRequest } = useRestRequest();

  async function handleChange( checked: boolean ) {
    const prevSetting = setting;
    const updatedSetting = { ...setting, value: checked };

    await optimistic(
      async () =>
        await proxyApiRequest< App.Data.SiteSettingData[] >( 'siteSettingSave', updatedSetting ),
      () => {
        updateSetting( 'convoOnly', updatedSetting );
        setEnabled( checked );
      },
      () => {
        updateSetting( 'convoOnly', prevSetting );
        setEnabled( ! checked );
      },
    );
  }

  return setting?.canUpdate ? (
    <label className="flex items-center gap-1.5 text-sm">
      <ChatSwitch checked={ enabled } onCheckedChange={ handleChange } />
      Convo Only
    </label>
  ) : setting?.value === true ? (
    <AgentTooltip
      content={
        <p>
          Agentic actions are currently disabled and will roll out in the coming weeks.{ ' ' }
          <a href="https://agentwp.com/kb/convo-only-mode/">More info</a>
        </p>
      }>
      <label className="flex items-center gap-1.5 opacity-75 cursor-not-allowed">
        <ChatSwitch checked={ enabled } disabled={ ! setting?.canUpdate } />
        Convo Only
      </label>
    </AgentTooltip>
  ) : (
    <label className="flex items-center gap-1.5 opacity-75 cursor-not-allowed">
      <ChatSwitch checked={ enabled } disabled={ ! setting?.canUpdate } />
      Convo Only
    </label>
  );
}
