import { createContext, useContext, useState } from 'react';
import type { PageData, SiteSettingValue, SiteSettingData } from '@/Types/types';

type PageContextType = {
  page: PageData;
  setPageData: ( page: PageData ) => void;
  canAccessAgent: boolean;
  isPage: ( pageContains: string ) => boolean;
  getAccountSetting: ( name: SiteSettingValue ) => SiteSettingData | undefined;
};

export const PageContext = createContext< PageContextType | undefined >( undefined );

export function usePage() {
  const page = useContext( PageContext );
  if ( page === undefined ) {
    throw new Error( 'usePage must be used within a PageProvider' );
  }
  return page;
}

export function PageProvider( { page, children }: { page: any; children: React.ReactNode } ) {
  const [ pageData, setPageData ] = useState( page );

  const canAccessAgent = pageData.onboarding_completed && pageData.agentwp_access;

  const isPage = ( pageContains: string ) => {
    const currentPage = window.location.href;
    return currentPage.indexOf( pageContains ) === -1;
  };

  function getAccountSetting( name: SiteSettingValue ) {
    return pageData.account_settings.find( ( setting: SiteSettingData ) => setting.name === name );
  }

  return (
    <PageContext.Provider
      value={ { page: pageData, setPageData, canAccessAgent, isPage, getAccountSetting } }>
      { children }
    </PageContext.Provider>
  );
}
