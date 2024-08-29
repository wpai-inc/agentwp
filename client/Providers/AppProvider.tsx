import { useState, createContext, useContext, useEffect } from 'react';
import { TokenUsageStatus } from '@/Types/enums';

const AppContext = createContext( {
  cooldownTime: null,
  turnedOff: false,
  tokenUsageStatus: TokenUsageStatus.Normal,
  setCooldownTime: ( _cooldownTime: Date ) => {},
  setTurnedOff: ( _turnedOff: boolean ) => {},
  setTokenUsageStatus: ( _usageStatus: TokenUsageStatus ) => {},
} );

export function useApp() {
  const chat = useContext( AppContext );
  if ( ! chat ) {
    throw new Error( 'useApp must be used within a AppProvider' );
  }
  return chat;
}

export default function AppProvider( { children }: { children: React.ReactNode } ) {
  const [ cooldownTime, setCooldownTime ] = useAppStorage( 'cooldownTime', null );
  const [ turnedOff, setTurnedOff ] = useAppStorage( 'turnedOff', false );
  const [ tokenUsageStatus, setTokenUsageStatus ] = useAppStorage(
    'tokenUsageStatus',
    TokenUsageStatus.Normal,
  );

  useEffect( () => {
    if ( cooldownTime && new Date( cooldownTime ) < new Date() ) {
      setCooldownTime( null );
      setTokenUsageStatus( TokenUsageStatus.Normal );
    }
  }, [ cooldownTime ] );

  return (
    <AppContext.Provider
      value={ {
        cooldownTime,
        turnedOff,
        tokenUsageStatus,
        setCooldownTime,
        setTurnedOff,
        setTokenUsageStatus,
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
