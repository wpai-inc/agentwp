import { createContext, useContext } from 'react';
import { usePage } from '@/Providers/PageProvider';
import axios from 'axios';
import { useNotifications } from '@/Providers/NotificationProvider';

export const AdminRouteContext = createContext< any | undefined >( undefined );

export function useAdminRoute() {
  const client = useContext( AdminRouteContext );
  if ( client === undefined ) {
    throw new Error( 'useAdminRoute must be used within a AdminRouteProvider' );
  }
  return client;
}

export function AdminRouteProvider( { children }: { children: React.ReactNode } ) {
  const { page } = usePage();
  const { notify } = useNotifications();

  const adminRequest = axios.create( {
    baseURL: page.rest_route + page.rest_endpoint + '/',
    headers: {
      'X-WP-Nonce': page.wp_rest_nonce,
    },
  } );

  adminRequest.interceptors.request.use( config => {
    const nonce = page?.nonce;
    if ( nonce ) {
      config.params = {
        ...config.params,
        nonce,
      };
    }
    return config;
  } );

  const tryRequest = async (
    method: 'post' | 'get',
    url: string,
    dataOrParams?: any,
    onBefore?: () => void,
    onFailure?: ( error: any ) => void,
  ) => {
    onBefore && onBefore();
    try {
      if ( method === 'post' ) {
        return await adminRequest.post( url, dataOrParams );
      } else {
        return await adminRequest.get( url, { params: dataOrParams } );
      }
    } catch ( error ) {
      if ( onFailure ) {
        // @todo: Needs some typing that corresponse with our controllers and the wp_send_json_error function
        const msg = error.response.data.data;
        notify.error( msg );
        onFailure( msg );
      }
      throw error; // Optionally rethrow if you want to handle it higher up
    }
  };

  return (
    <AdminRouteContext.Provider value={ { adminRequest, tryRequest } }>
      { children }
    </AdminRouteContext.Provider>
  );
}

export type RouteRunActionQuery = {
  results: any[];
};
