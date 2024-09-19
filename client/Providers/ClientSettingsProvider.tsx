import { createContext, FC, useContext, useEffect, useState, Dispatch } from 'react';
import { getStorage, setStorage } from '@/lib/utils';

export type ClientSettings = {
  chatOpen: boolean;
  chatMaximized: boolean;
  turnedOff: boolean;
  right: number;
  bottom: number;
  width: number;
  height: number;
  updateDismissed: boolean;
  betaDismissed: boolean;
};

type ClientSettingValue = string | boolean | number | null | object;

interface ContextProps {
  settings: ClientSettings;
  setSettings: Dispatch< ClientSettings >;
  updateSetting: ( key: keyof ClientSettings, value: ClientSettingValue ) => void;
}

const namespace = 'awp_settings.';

function setLocalStorage( key: keyof ClientSettings, value: ClientSettingValue ) {
  setStorage( namespace + key, JSON.stringify( value ) );
}

export function getLocalStorage(
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
    chatOpen: getLocalStorage( 'chatOpen', false ) as boolean,
    chatMaximized: getLocalStorage( 'chatMaximized', false ) as boolean,
    turnedOff: getLocalStorage( 'turnedOff', false ) as boolean,
    right: getLocalStorage( 'right', 16 ) as number,
    bottom: getLocalStorage( 'bottom', 16 ) as number,
    width: getLocalStorage( 'width', 400 ) as number,
    height: getLocalStorage( 'height', 800 ) as number,
    updateDismissed: getLocalStorage( 'updateDismissed', false ) as boolean,
    betaDismissed: getLocalStorage( 'betaDismissed', false ) as boolean,
  } );

  function updateSetting( key: keyof ClientSettings, value: ClientSettingValue ) {
    setSettings( prev => ( { ...prev, [ key ]: value } ) );
  }

  useEffect( () => {
    for ( const [ key, value ] of Object.entries( settings ) ) {
      setLocalStorage( key as keyof ClientSettings, value );
    }
  }, [ settings ] );

  return (
    <ClientSettingsContext.Provider value={ { settings, setSettings, updateSetting } }>
      { children }
    </ClientSettingsContext.Provider>
  );
};

export default ClientSettingsProvider;
