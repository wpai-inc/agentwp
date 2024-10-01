import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRestRequest } from './RestRequestProvider';

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
  const { proxyApiRequest } = useRestRequest();
  const [ account, setAccount ] = useState< AccountType >();

  useEffect( () => {
    proxyApiRequest< AccountType >( 'user' ).then( data => setAccount( data ) );
  }, [] );

  return (
    <AccountContext.Provider
      value={ {
        account,
      } }>
      { children }
    </AccountContext.Provider>
  );
}
