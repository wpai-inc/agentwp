import { createContext, useContext } from 'react';
export const ClientContext = createContext<any | undefined>(undefined);
import AwpClient from '@/Services/AwpClient';
import { usePage } from '@/Providers/PageProvider';

export function useClient() {
  const client = useContext(ClientContext);
  if (client === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return client;
}

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const page = usePage();
  const client = new AwpClient(page.access_token).setBaseUrl(page.api_host);
  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}
