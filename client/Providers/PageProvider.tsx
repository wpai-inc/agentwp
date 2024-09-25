import { createContext, useContext, ReactNode } from 'react';
import type { PageData } from '@/Types/types';
import routes from '../../server/Modules/AwpClient/routes.json';
import { get } from 'http';

// Define a generic type that extends PageData
interface PageProviderProps< T extends PageData > {
  page: T;
  children: ReactNode;
}

// Generic PageContextType that uses T extends PageData
interface PageContextType< T extends PageData > {
  page: T;
  canAccessAgent: boolean;
  isPage: ( pageContains: string ) => boolean;
  getAccountSetting: ( name: App.Enums.SiteSettingValue, defaultValue: any ) => any;
  userProfileUrl: string;
  getApiUrl: ( name: string ) => string;
}

// Create a context with the generic type
const PageContext = createContext< PageContextType< PageData > | null >( null );

// Custom hook to use the page context with generic
export function usePage< T extends PageData >() {
  const context = useContext( PageContext ) as PageContextType< T > | null;
  if ( ! context ) {
    throw new Error( 'usePage must be used within a PageProvider' );
  }
  return context; // Directly return the context since it holds the generic page
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Route = {
  key: string;
  name: string;
  methods: HttpMethod[];
  uri: string;
};

// Update the PageProvider to pass the generic type
export function PageProvider< T extends PageData >( { page, children }: PageProviderProps< T > ) {
  const canAccessAgent = page.onboarding_completed && page.agentwp_access;

  const userProfileUrl = page.api_host + '/dashboard';

  const isPage = ( pageContains: string ) => {
    const currentPage = window.location.href;
    return currentPage.indexOf( pageContains ) === -1;
  };

  function getApiRoute( name: string ) {
    return routes.find( ( route: Route ) => route.name === name );
  }

  function getApiUrl( name: string ) {
    return page.api_host + '/' + getApiRoute( name ).uri;
  }

  function getAccountSetting( name: App.Enums.SiteSettingValue, defaultValue: any = null ) {
    return (
      page.account_settings.find(
        ( setting: App.Data.SiteSettingData ) => setting.name === name,
      ) || defaultValue
    );
  }

  return (
    <PageContext.Provider
      value={ {
        page,
        canAccessAgent,
        isPage,
        getAccountSetting,
        userProfileUrl,
        getApiUrl,
      } }>
      { children }
    </PageContext.Provider>
  );
}
