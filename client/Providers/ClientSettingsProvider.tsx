import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getStorage, setStorage } from '@/lib/utils';

export type ClientSettings = {
  sidebarWidth?: number | null;
  navCollapsed?: boolean;
  bannerDismissed?: boolean;
  topBannerDismissed?: string;
};

type UiSettingValue = string | boolean | number | null;

interface ContextProps {
  settings: ClientSettings;
  setSettings: React.Dispatch<React.SetStateAction<ClientSettings>>;
}

function setLocalStorage(key: keyof ClientSettings, value: UiSettingValue) {
  setStorage(key, JSON.stringify(value));
}

function getLocalStorage(key: keyof ClientSettings, defaultValue: any = null) {
  const value = getStorage(key, defaultValue);
  return value ? JSON.parse(value) : defaultValue;
}

export const ClientSettingsContext = createContext<ContextProps | undefined>(
  undefined,
);

export const useClientSettings = () => {
  const context = useContext(ClientSettingsContext);
  if (!context) {
    throw new Error(
      `useClientSettings must be used within an ClientSettingsProvider`,
    );
  }
  return context;
};

export const ClientSettingsProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<ClientSettings>({
    sidebarWidth: getLocalStorage('sidebarWidth', null),
    navCollapsed: getLocalStorage('navCollapsed', true),
    bannerDismissed: getLocalStorage('bannerDismissed', false),
    topBannerDismissed: getLocalStorage('topBannerDismissed', ''),
  });

  useEffect(() => {
    for (const [key, value] of Object.entries(settings)) {
      setLocalStorage(key as keyof ClientSettings, value);
    }
  }, [settings]);

  return (
    <ClientSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </ClientSettingsContext.Provider>
  );
};

export default ClientSettingsProvider;
