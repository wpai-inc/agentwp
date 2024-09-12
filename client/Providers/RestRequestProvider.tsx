import { createContext, useContext } from 'react';
import { usePage } from '@/Providers/PageProvider';
import axios from 'axios';
import { useNotifications } from '@/Providers/NotificationProvider';
import { optimistic } from '@/lib/utils';

export const RestRequestContext = createContext< any | undefined >( undefined );

export function useRestRequest() {
  const client = useContext( RestRequestContext );
  if ( client === undefined ) {
    throw new Error( 'useRestRequest must be used within a RestRequestProvider' );
  }
  return client;
}

export function RestRequestProvider( { children }: { children: React.ReactNode } ) {
  const { page } = usePage();
  const { notify } = useNotifications();

  const restReq = axios.create( {
    baseURL: page.rest_route + page.rest_endpoint + '/',
    headers: {
      'X-WP-Nonce': page.wp_rest_nonce,
    },
  } );

  restReq.interceptors.request.use( config => {
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
    const req =
      method === 'post'
        ? restReq.post( url, dataOrParams )
        : restReq.get( url, { params: dataOrParams } );
    onBefore && onBefore();

    const catchFailure = ( e: any ) => {
      const msg = e.response.data.data;
      notify.error( msg );
      onFailure && onFailure( msg );
    };

    return optimistic( async () => req, onBefore, catchFailure );
  };

  const apiRequest = async ( endpoint: string, dataOrParams?: any ) => {
    return restReq.post( 'api', { ...dataOrParams, endpoint } );
  };

  return (
    <RestRequestContext.Provider value={ { restReq, tryRequest, apiRequest } }>
      { children }
    </RestRequestContext.Provider>
  );
}

export type RouteRunActionQuery = {
  results: any[];
};
