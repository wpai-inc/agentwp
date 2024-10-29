import { createContext, useContext, useState, useCallback } from 'react';
import { usePage } from '@/Providers/PageProvider';

export type AccountSettings = {};

interface ContextProps {
  getAccountSetting: ( name: App.Enums.SiteSettingValue, defaultValue?: any ) => any;
  accountSettings: App.Data.SiteSettingData[];
  setAccountSettings: ( settings: App.Data.SiteSettingData[] ) => void;
  updateSetting: ( name: App.Enums.SiteSettingValue, setting: App.Data.SiteSettingData ) => void;
}

export const AccountSettingsContext = createContext< ContextProps | undefined >( undefined );

export const useAccountSettings = () => {
  const context = useContext( AccountSettingsContext );
  if ( ! context ) {
    throw new Error( `useAccountSettings must be used within an AccountSettingsProvider` );
  }
  return context;
};

export default function AccountSettingsProvider( { children }: { children: JSX.Element } ) {
  const { page } = usePage();

  const [ accountSettings, setAccountSettings ] = useState< App.Data.SiteSettingData[] >(
    page.account_settings,
  );

  function updateSetting( name: App.Enums.SiteSettingValue, setting: App.Data.SiteSettingData ) {
    setAccountSettings( prev => [ ...prev.filter( s => s.name !== name ), setting ] );
  }

  const getAccountSetting = useCallback(
    ( name: App.Enums.SiteSettingValue, defaultValue: any = null ) => {
      return (
        accountSettings.find( ( setting: App.Data.SiteSettingData ) => setting.name === name ) ||
        defaultValue
      );
    },
    [ accountSettings ],
  );

  return (
    <AccountSettingsContext.Provider
      value={ {
        accountSettings,
        getAccountSetting,
        setAccountSettings,
        updateSetting,
      } }>
      { children }
    </AccountSettingsContext.Provider>
  );
}
