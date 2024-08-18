import ConnectToAwp from './SubPages/ConnectToAwp';
import * as Tabs from '@radix-ui/react-tabs';
import UsersManagement from '@/Page/Admin/Settings/SubPages/UsersManagement';
import Dashboard from '@/Page/Admin/Settings/SubPages/Dashboard';
import GeneralSettings from './SubPages/GeneralSettings';
import { usePage } from '@/Providers/PageProvider';
import { ReactNode } from 'react';
import LogoImg from '@/assets/awp.webp';
import { Button } from '@/Components/ui/button';

const tabClasses =
  'px-5 py-4 flex items-center justify-center text-base leading-none select-none hover:text-brand-primary data-[state=active]:text-brand-dark  data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-brand-primary outline-none cursor-pointer';

function SettingsTab( { value, title }: { value: string; title: string } ) {
  return (
    <Tabs.Trigger className={ tabClasses } value={ value }>
      { title }
    </Tabs.Trigger>
  );
}

function SettingsTabContent( { value, children }: { value: string; children: ReactNode } ) {
  return (
    <Tabs.Content className="grow p-5 rounded-b-md outline-none" value={ value }>
      { children }
    </Tabs.Content>
  );
}

export default function Settings() {
  const { page } = usePage();

  const url = new URL( window.location.href );
  const initialTab = url.searchParams.get( 'tab' ) || 'dashboard';

  function handleTabChange( value: string ) {
    url.searchParams.set( 'tab', value );
    window.history.pushState( {}, '', url );
  }

  return (
    <div className="-ml-5">
      <Tabs.Root defaultValue={ initialTab } onValueChange={ value => handleTabChange( value ) }>
        <div className="bg-white p-6 pb-0">
          <div className="flex justify-between">
            <div>
              <img src={ LogoImg } alt="AgentWP" className="w-10 h-10 inline-block mr-2" />
              <span className="ml-3 inline-flex rounded-full items-center justify-center bg-brand-dark text-white px-3 py-2 text-sm font-bold uppercase">
                Free
              </span>
            </div>
            <div className="text-right">
              <Button variant="brand" pill={ true }>
                Upgrade to Pro
              </Button>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-center md:items-end justify-center md:justify-between">
            <Tabs.List className="flex mt-5" aria-label="Manage your account">
              <SettingsTab value="dashboard" title="About" />
              { page.agentwp_manager && (
                <SettingsTab value="connect" title="AI Connection Manager" />
              ) }
              { page.agentwp_users_manager && <SettingsTab value="users" title="Users" /> }
              { page.agentwp_manager && (
                <SettingsTab value="general_settings" title="General Settings" />
              ) }
            </Tabs.List>
            <Tabs.List className="flex mt-5 justify-end" aria-label="Manage your account">
              <a className={ tabClasses } href="https://app.agentwp.com/support">
                Support
              </a>
              <a className={ tabClasses } href="https://agentwp.com/blog">
                What's New?
              </a>
              <a className={ tabClasses } href="https://app.agentwp.com/dashboard">
                Account
              </a>
            </Tabs.List>
          </div>
        </div>
        <SettingsTabContent value="dashboard">
          <Dashboard />
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
