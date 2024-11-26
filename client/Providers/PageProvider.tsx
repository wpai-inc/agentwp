import { useRef, createContext, useContext, ReactNode } from 'react';
import type { PageData } from '@/Types/types';
import routes from '../../server/Modules/AwpClient/routes.json';
import i18n from '@/i18n';

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
  userProfileUrl: string;
  getApiUrl: ( name: string ) => string;
  isConnected: boolean;
  root: React.MutableRefObject< HTMLDivElement | null >;
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
  const shadowRoot = useRef( null );
  const isOnboarded = parseInt( page.onboarding_completed ) === 1;
  const isConnected = parseInt( page.is_connected ) === 1;
  const hasAccess = parseInt( page.agentwp_access ) === 1;
  const canAccessAgent = isOnboarded && hasAccess;

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

  console.log( 'PageProvider', page );

  i18n.addResources( page.lang, 'translation', page.translations );
  i18n.changeLanguage( page.lang );

  return (
    <PageContext.Provider
      value={ {
        page,
        canAccessAgent,
        isPage,
        userProfileUrl,
        getApiUrl,
        isConnected,
        root: shadowRoot,
      } }>
      <root.div ref={ shadowRoot }>{ children }</root.div>
    </PageContext.Provider>
  );
}
