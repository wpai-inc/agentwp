/**
 * @since 1.0.1
 */
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRestRequest } from './RestRequestProvider';
import { usePage } from './PageProvider';

export type AccountType = {
  user: App.Data.UserData;
  plan: App.Data.PlanData;
  upgrade_link: string;
  config: App.Data.ConfigData;
};

interface AccountContextType {
  account?: AccountType;
}

const AccountContext = createContext< AccountContextType | null >( null );

export function useAccount() {
  const context = useContext( AccountContext ) as AccountContextType | null;
  if ( ! context ) {
    throw new Error( 'usePage must be used within a AccountProvider' );
  }
  return context;
}

export function AccountProvider( { children }: { children: ReactNode } ) {
  const { isConnected } = usePage();
  const { proxyApiRequest } = useRestRequest();
  const [ account, setAccount ] = useState< AccountType >();

  useEffect( () => {
    if ( isConnected ) {
      proxyApiRequest< AccountType >( 'user' ).then( data => setAccount( data ) );
    }
  }, [ isConnected ] );

  return (
    <AccountContext.Provider
      value={ {
        account,
      } }>
      { children }
    </AccountContext.Provider>
  );
}
