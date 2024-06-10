import { createContext, FC, useContext, useEffect, useState } from 'react';
import { getStorage, setStorage } from '@/lib/utils';

export type ClientSettings = {
  chatOpen?: boolean;
  chatMaximized?: boolean;
  x: number;
  y: number;
  width: string;
  height: string;
};

type ClientSettingValue = string | boolean | number | null;

interface ContextProps {
  settings: ClientSettings;
  setSettings: React.Dispatch< React.SetStateAction< ClientSettings > >;
}

const namespace = 'awp_settings.';

function setLocalStorage( key: keyof ClientSettings, value: ClientSettingValue ) {
  setStorage( namespace + key, JSON.stringify( value ) );
}

function getLocalStorage(
  key: keyof ClientSettings,
  defaultValue: ClientSettingValue = null,
): ClientSettingValue {
  const value = getStorage( namespace + key, defaultValue );
  try {
    return JSON.parse( value );
  } catch ( e ) {
    return value;
  }
}

export const ClientSettingsContext = createContext< ContextProps | undefined >( undefined );

export const useClientSettings = () => {
  const context = useContext( ClientSettingsContext );
  if ( ! context ) {
    throw new Error( `useClientSettings must be used within an ClientSettingsProvider` );
  }
  return context;
};

export const ClientSettingsProvider: FC< { children: React.ReactNode } > = ( { children } ) => {
  const [ settings, setSettings ] = useState< ClientSettings >( {
    chatOpen: getLocalStorage( 'chatOpen', false ),
    chatMaximized: getLocalStorage( 'chatMaximized', false ),
    x: getLocalStorage( 'x', window.innerWidth - 16 ),
    y: getLocalStorage( 'y', window.innerHeight - 16 ),
    width: getLocalStorage( 'width', '400px' ),
    height: getLocalStorage( 'height', ( 2 * window.innerHeight ) / 3 + 'px' ),
  } );

  useEffect( () => {
    for ( const [ key, value ] of Object.entries( settings ) ) {
      setLocalStorage( key as keyof ClientSettings, value );
    }
  }, [ settings ] );

  return (
    <ClientSettingsContext.Provider value={ { settings, setSettings } }>
      { children }
    </ClientSettingsContext.Provider>
  );
};

export default ClientSettingsProvider;
