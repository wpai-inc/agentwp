import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { getStorage, setStorage } from '@/lib/utils';

export type ClientSettings = {
  chatOpen?: boolean;
  chatMaximized?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
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

function getLocalStorage( key: keyof ClientSettings, defaultValue: ClientSettingValue = null ) {
  const value = getStorage( namespace + key, defaultValue );
  return value ? JSON.parse( value ) : defaultValue;
}

export const ClientSettingsContext = createContext< ContextProps | undefined >( undefined );

export const useClientSettings = () => {
  const context = useContext( ClientSettingsContext );
  if ( ! context ) {
    throw new Error( `useClientSettings must be used within an ClientSettingsProvider` );
  }
  return context;
};

export const getSettingDefaultValues = () => ( {
  x: screen.width - 440,
  y: -screen.height,
  width: 400,
  height: 972,
} );

export const ClientSettingsProvider: FC< { children: React.ReactNode } > = ( { children } ) => {
  const settingsDefaultValues = getSettingDefaultValues();
  const [ settings, setSettings ] = useState< ClientSettings >( {
    chatOpen: getLocalStorage( 'chatOpen', false ),
    chatMaximized: getLocalStorage( 'chatMaximized', false ),
    x: getLocalStorage( 'x', settingsDefaultValues.x ),
    y: getLocalStorage( 'y', settingsDefaultValues.y ),
    width: getLocalStorage( 'width', settingsDefaultValues.width ),
    height: getLocalStorage( 'height', settingsDefaultValues.height ),
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
