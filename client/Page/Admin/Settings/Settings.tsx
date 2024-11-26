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
import { useTranslation } from 'react-i18next';

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
    <Tabs.Content className="flex-1 p-5" value={ value }>
      { children }
    </Tabs.Content>
  );
}

export default function Settings() {
  const { t } = useTranslation();
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
  );

  function SettingsHeader() {
    return (
      <div className="z-50 p-6 pb-0 bg-white md:sticky md:top-8">
        <div className="flex justify-between">
          <div>
            <img src={ LogoImg } alt="AgentWP" className="inline-block w-10 h-10 mr-2" />
            { account?.plan?.slug === 'pro' && (
              <span className="inline-flex items-center justify-center px-3 py-2 ml-3 text-sm font-bold text-white uppercase rounded-full bg-brand-dark">
                { account?.plan.name }
              </span>
            ) }
          </div>
          { account?.plan?.slug === 'free' && (
            <div className="text-right">
              <Button variant="brand" pill={ true }>
                <a href={ account?.upgrade_link }>{ t( 'Upgrade to Pro' ) }</a>
              </Button>
            </div>
          ) }
        </div>
        <div className="flex flex-col-reverse items-center justify-center md:flex-row md:items-end md:justify-between md:mt-5">
          <Tabs.List className="flex" aria-label={ t( 'Manage your account' ) }>
            <Tab value="dashboard" title={ t( 'Dashboard' ) } />
            { page.agentwp_users_manager && <Tab value="users" title={ t( 'Access' ) } /> }
            <Tab value="history" title={ t( 'History' ) } />
            <AgentTooltip content={ t( 'Coming soon' ) } side="top">
              <button className={ tabClasses } disabled>
                { t( 'Integrations' ) }
              </button>
            </AgentTooltip>
            <AgentTooltip content={ t( 'Coming soon' ) } side="top">
              <button className={ tabClasses } disabled>
                { t( 'Tasks' ) }
              </button>
            </AgentTooltip>

            { page.agentwp_manager && <Tab value="settings" title={ t( 'Settings' ) } /> }
          </Tabs.List>
          <Tabs.List
            className="flex items-end justify-end"
            aria-label={ t( 'Manage your account' ) }>
            <a className={ tabClasses } href="https://app.agentwp.com/support">
              { t( 'Support' ) }
            </a>
            <a className={ tabClasses } href="https://agentwp.com/blog">
              { t( "What's New?" ) }
            </a>
            <a className={ tabClasses } href="https://app.agentwp.com/dashboard">
              { t( 'Account' ) }
            </a>
          </Tabs.List>
        </div>
      </div>
    );
  }
}
