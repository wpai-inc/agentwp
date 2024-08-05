import { createContext, useContext, useState } from 'react';
export const PageContext = createContext< any | undefined >( undefined );

export function usePage() {
  const page = useContext( PageContext );
  if ( page === undefined ) {
    throw new Error( 'usePage must be used within a PageProvider' );
  }
  return page;
}

export function PageProvider( {
  page,
  root,
  reactRoot,
  children,
}: {
  page: any;
  root: HTMLElement;
  reactRoot: any;
  children: React.ReactNode;
} ) {
  const [ pageData, setPageData ] = useState( page );

  const canAccessAgent = pageData.onboarding_completed && pageData.agentwp_access;
  const isPage = ( pageContains: string ) => {
    const currentPage = window.location.href;
    return currentPage.indexOf( pageContains ) === -1;
  };

  return (
    <PageContext.Provider
      value={ { page: pageData, setPageData, canAccessAgent, isPage, root, reactRoot } }>
      { children }
    </PageContext.Provider>
  );
}
