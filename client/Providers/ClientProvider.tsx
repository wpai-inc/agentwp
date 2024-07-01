import { createContext, useContext } from 'react';
export const ClientContext = createContext< any | undefined >( undefined );
import AwpClient from '@/Services/AwpClient';
import { usePage } from '@/Providers/PageProvider';

// Todo:

export function useClient() {
  const client = useContext( ClientContext );
  if ( client === undefined ) {
    throw new Error( 'useClient must be used within a ClientProvider' );
  }
  return client;
}

export type HistoryType = {
  items: {
    data: HistoryItem[];
  };
  lastRequest?: {
    id: string;
    createdAt: string;
    humanCreatedAt: string;
    message: string;
  };
};

export type HistoryItem = {
  createdAt: string;
  humanCreatedAt: string;
};

export function ClientProvider( { children }: { children: React.ReactNode } ) {
  const { page } = usePage();

  const userProfileUrl = page.api_host + '/dashboard';

  async function getHistory( since?: string ): Promise< HistoryType[] > {
    const response = await client.getHistory( since );
    return response.data as HistoryType[];
  }

  async function clearConversation() {
    await client.clearConversation();
  }

  async function unclearConversation( since: string ) {
    await client.unclearConversation( since );
  }

  async function updateSetting( name: string, value: any ) {
    const response = await client.updateSetting( name, value );
    return response.data;
  }

  async function getSettings() {
    const res = await client.getSettings();
    return res?.data?.data;
  }

  async function getConversation( since?: string ) {
    const res = await client.isAuthorized()?.getConversation( since );
    return res?.data?.data;
  }

  const client = new AwpClient( page.access_token ).setBaseUrl( page.api_host );
  return (
    <ClientContext.Provider
      value={ {
        client,
        getHistory,
        getConversation,
        clearConversation,
        unclearConversation,
        userProfileUrl,
        getSettings,
        updateSetting,
      } }>
      { children }
    </ClientContext.Provider>
  );
}
