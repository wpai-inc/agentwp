import ConnectToAwp from './SubPages/ConnectToAwp';
import * as Tabs from '@radix-ui/react-tabs';
import UsersManagement from '@/Page/Admin/Settings/SubPages/UsersManagement';
import Info from '@/Page/Admin/Settings/SubPages/Info';
import GeneralSettings from './SubPages/GeneralSettings';
import { usePage } from '@/Providers/PageProvider';
import { ReactNode } from 'react';

function SettingsTab( { value, title }: { value: string; title: string } ) {
  return (
    <Tabs.Trigger
      className="bg-white px-5 h-[45px] flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current outline-none cursor-pointer"
      value={ value }>
      { title }
    </Tabs.Trigger>
  );
}

function SettingsTabContent( { value, children }: { value: string; children: ReactNode } ) {
  return (
    <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none" value={ value }>
      { children }
    </Tabs.Content>
  );
}

export default function Settings() {
  const { page } = usePage();

  const url = new URL( window.location.href );
  const initialTab = url.searchParams.get( 'tab' ) || 'info';

  function handleTabChange( value: string ) {
    url.searchParams.set( 'tab', value );
    window.history.pushState( {}, '', url );
  }

  return (
    <div className="m-4">
      <div>
        <h1 className="text-2xl font-bold">AgentWP Settings</h1>
      </div>
      <Tabs.Root
        className="flex flex-col shadow-blackA2 mt-4"
        defaultValue={ initialTab }
        onValueChange={ value => handleTabChange( value ) }>
        <Tabs.List className="flex border-b border-mauve6" aria-label="Manage your account">
          <SettingsTab value="info" title="About" />
          { page.agentwp_manager && <SettingsTab value="connect" title="AI Connection Manager" /> }
          { page.agentwp_users_manager && <SettingsTab value="users" title="Users" /> }
          { page.agentwp_manager && (
            <SettingsTab value="general_settings" title="General Settings" />
          ) }
        </Tabs.List>
        <SettingsTabContent value="info">
          <Info />
        </SettingsTabContent>
        <SettingsTabContent value="connect">
          <ConnectToAwp />
        </SettingsTabContent>
        <SettingsTabContent value="users">
          <UsersManagement />
        </SettingsTabContent>
        <SettingsTabContent value="general_settings">
          <GeneralSettings />
        </SettingsTabContent>
      </Tabs.Root>
    </div>
  );
}
