import { createContext, useContext } from 'react';
export const AppContext = createContext< any | undefined >( undefined );

export function useApp() {
  const app = useContext( AppContext );
  if ( app === undefined ) {
    throw new Error( 'useApp must be used within a AppProvider' );
  }
  return app;
}

export function AppProvider( { apps, children }: { apps: any; children: React.ReactNode } ) {
  return <AppContext.Provider value={ apps }>{ children }</AppContext.Provider>;
}
