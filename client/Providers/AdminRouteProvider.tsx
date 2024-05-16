import { createContext, useContext } from 'react';
import { usePage } from '@/Providers/PageProvider';
import axios from 'axios';

export const AdminRouteContext = createContext<any | undefined>(undefined);

export function useAdminRoute() {
  const client = useContext(AdminRouteContext);
  if (client === undefined) {
    throw new Error('useAdminRoute must be used within a AdminRouteProvider');
  }
  return client;
}

export function AdminRouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const page = usePage();

  const adminRequest = axios.create({
    baseURL: page.rest_route,
    headers: {
      'X-WP-Nonce': page.wp_rest_nonce,
    },
  });

  adminRequest.interceptors.request.use((config) => {
    const nonce = page?.nonce;
    if (nonce) {
      config.params = {
        ...config.params,
        nonce,
      };
    }
    return config;
  });

  return (
    <AdminRouteContext.Provider value={adminRequest}>
      {children}
    </AdminRouteContext.Provider>
  );
}

export type RouteRunActionQuery = {
  results: any[];
};
