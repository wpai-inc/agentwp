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
  created_at: string;
  human_created_at: string;
};

export function ClientProvider( { children }: { children: React.ReactNode } ) {
  const { page } = usePage();

  const userProfileUrl = page.api_host + '/dashboard';

  async function getHistory(): Promise< HistoryType[] > {
    const response = await client.getHistory( page.site_id, page.user.ID );
    return response.data.data as HistoryType[];
  }

  async function clearConversation() {
    await client.clearConversation( page.site_id, page.user.ID );
  }

  async function getConversation() {
    const res = await client.isAuthorized()?.getConversation( page.site_id, page.user.ID );
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
        userProfileUrl,
      } }>
      { children }
    </ClientContext.Provider>
  );
}
