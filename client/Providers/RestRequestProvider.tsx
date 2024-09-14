import { createContext, useContext } from 'react';
import { usePage } from '@/Providers/PageProvider';
import axios, { AxiosInstance } from 'axios';
import { useNotifications } from '@/Providers/NotificationProvider';
import { optimistic } from '@/lib/utils';

type RestRequestContextType = {
  restReq: AxiosInstance;
  tryRequest: (
    method: 'post' | 'get',
    url: string,
    dataOrParams?: any,
    onBefore?: () => void,
    onFailure?: ( error: any ) => void,
  ) => Promise< any >;
  apiRequest: < T = any >( endpoint: string, dataOrParams?: any ) => Promise< T >;
  requestUrl: ( name: string ) => string;
  nonceHeader: Record< string, string >;
};

export const RestRequestContext = createContext< RestRequestContextType | undefined >( undefined );

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

  const baseURL = page.rest_route + page.rest_endpoint + '/';
  const nonceHeader = {
    'X-WP-Nonce': page.wp_rest_nonce,
  };

  const restReq: AxiosInstance = axios.create( { baseURL, headers: { ...nonceHeader } } );

  const requestUrl = ( name: string ) => {
    return page.rest_route + name;
  };

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

  const apiRequest = async < T = any, >( endpoint: string, dataOrParams?: any ): Promise< T > => {
    const response = await restReq.post< T >( 'api', { ...dataOrParams, endpoint } );
    return response.data;
  };

  return (
    <RestRequestContext.Provider
      value={ { restReq, requestUrl, tryRequest, apiRequest, nonceHeader } }>
      { children }
    </RestRequestContext.Provider>
  );
}
