import ConnectToAwp from './SubPages/SettingsTab';
import * as Tabs from '@radix-ui/react-tabs';
import UsersManagement from '@/Page/Admin/Settings/SubPages/UsersManagement';
import SettingsTab from '@/Page/Admin/Settings/SubPages/SettingsTab';
import Dashboard from '@/Page/Admin/Settings/SubPages/Dashboard';
import { usePage } from '@/Providers/PageProvider';
import { ReactNode } from 'react';
import LogoImg from '@/assets/awp.webp';
import { Button } from '@/Components/ui/button';
import { AgentTooltip } from '@/Components/ui/tooltip';
import History from './SubPages/History';
import { useAccount } from '@/Providers/AccountProvider';

const tabClasses =
  'px-3 lg:px-5 py-4 flex items-center justify-center text-sm lg:text-base leading-none select-none hover:text-brand-primary data-[state=active]:text-brand-dark  data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-brand-primary outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70';

function Tab( { value, title }: { value: string; title: string } ) {
  return (
    <Tabs.Trigger className={ tabClasses } value={ value }>
      { title }
    </Tabs.Trigger>
  );
}

function TabContent( { value, children }: { value: string; children: ReactNode } ) {
  return (
    <Tabs.Content className="p-5 flex-1" value={ value }>
      { children }
    </Tabs.Content>
  );
}

export default function Settings() {
  const { page } = usePage();
  const { account } = useAccount();

  const url = new URL( window.location.href );
  const initialTab = url.searchParams.get( 'tab' ) || 'dashboard';

  function handleTabChange( value: string ) {
    url.searchParams.set( 'tab', value );
    window.history.pushState( {}, '', url );
  }

  window.agentwp.classList.add( 'h-full' );

  return (
    <div className="-ml-5 h-full">
      <Tabs.Root
        defaultValue={ initialTab }
        onValueChange={ value => handleTabChange( value ) }
        className="flex flex-col h-full">
        <SettingsHeader />
        <TabContent value="dashboard">
          <Dashboard />
        </TabContent>
        <TabContent value="history">
          <History />
        </TabContent>
        <TabContent value="connect">
          <ConnectToAwp />
        </TabContent>
        <TabContent value="users">
          <UsersManagement />
        </TabContent>
        <TabContent value="settings">
          <SettingsTab />
        </TabContent>
      </Tabs.Root>
    </div>
  );

  function SettingsHeader() {
    return (
      <div className="bg-white p-6 pb-0 md:sticky md:top-8 z-50">
        <div className="flex justify-between">
          <div>
            <img src={ LogoImg } alt="AgentWP" className="w-10 h-10 inline-block mr-2" />
            { account?.plan?.slug === 'pro' && (
              <span className="ml-3 inline-flex rounded-full items-center justify-center bg-brand-dark text-white px-3 py-2 text-sm font-bold uppercase">
                { account?.plan.name }
              </span>
            ) }
          </div>
          { account?.plan?.slug === 'free' && (
            <div className="text-right">
              <Button variant="brand" pill={ true }>
                <a href={ account?.upgrade_link }>Upgrade to Pro</a>
              </Button>
            </div>
          ) }
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center md:items-end justify-center md:justify-between md:mt-5">
          <Tabs.List className="flex" aria-label="Manage your account">
            <Tab value="dashboard" title="Dashboard" />
            { page.agentwp_users_manager && <Tab value="users" title="Access" /> }
            <Tab value="history" title="History" />
            <AgentTooltip content="Coming soon" side="top">
              <button className={ tabClasses } disabled>
                Integrations
              </button>
            </AgentTooltip>
            <AgentTooltip content="Coming soon" side="top">
              <button className={ tabClasses } disabled>
                Tasks
              </button>
            </AgentTooltip>

            { page.agentwp_manager && <Tab value="settings" title="Settings" /> }
          </Tabs.List>
          <Tabs.List className="flex justify-end items-end" aria-label="Manage your account">
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
    );
  }
}
