import { useState, createContext, useContext } from 'react';

const AppContext = createContext( {
  turnedOff: false,
  setTurnedOff: ( _turnedOff: boolean ) => {},
} );

export function useApp() {
  const chat = useContext( AppContext );
  if ( ! chat ) {
    throw new Error( 'useApp must be used within a AppProvider' );
  }
  return chat;
}

export default function AppProvider( { children }: { children: React.ReactNode } ) {
  const [ turnedOff, setTurnedOff ] = useAppStorage( 'turnedOff', null );

  return (
    <AppContext.Provider
      value={ {
        turnedOff,
        setTurnedOff,
      } }>
      { children }
    </AppContext.Provider>
  );
}

const useAppStorage = ( key: string, initialValue: any ) => {
  key = 'awp_' + key;

  const [ storedValue, setStoredValue ] = useState( () => {
    const item = localStorage.getItem( key );
    return item ? JSON.parse( item ) : initialValue;
  } );

  const setValue = ( value: any ) => {
    setStoredValue( value );
    localStorage.setItem( key, JSON.stringify( value ) );
  };

  return [ storedValue, setValue ];
};
