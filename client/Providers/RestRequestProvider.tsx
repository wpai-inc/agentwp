import { createContext, useContext } from 'react';
import { usePage } from '@/Providers/PageProvider';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useNotifications } from '@/Providers/NotificationProvider';
import { optimistic } from '@/lib/utils';
import { WpResponse } from '@/Types/types';

type RestRequestContextType = {
  restReq: AxiosInstance;
  tryRequest: < T = any >(
    method: 'post' | 'get',
    url: string,
    dataOrParams?: any,
    onBefore?: () => void,
    onFailure?: ( error: any ) => void,
    throwError?: boolean,
  ) => Promise< WpResponse< T > >;
  proxyApiRequest: < T = any >( endpoint: string, dataOrParams?: any ) => Promise< T >;
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
    return baseURL + name;
  };

  const tryRequest = async < T = any, >(
    method: 'post' | 'get',
    url: string,
    dataOrParams?: any,
    onBefore?: () => void,
    onFailure?: ( error: any ) => void,
    throwError: boolean = true,
  ): Promise< WpResponse< T > > => {
    const req =
      method === 'post'
        ? restReq.post( url, dataOrParams )
        : restReq.get( url, { params: dataOrParams } );
    onBefore && onBefore();

    const catchFailure = ( e: any ) => {
      const msg = e.response.data.data;
      if ( throwError ) {
        notify(
          typeof msg === 'string'
            ? msg
            : msg?.message && typeof msg.message === 'string'
            ? msg.message
            : 'An unexpected error occurred.',
        );
      }
      onFailure && onFailure( msg );
    };

    return optimistic(
      async () => {
        const response = await req;
        return response.data;
      },
      onBefore,
      catchFailure,
    );
  };

  const proxyApiRequest = async < T = any, >(
    endpoint: string,
    dataOrParams?: any,
  ): Promise< T > => {
    try {
      const response = await restReq.post< T >( 'api', { ...dataOrParams, endpoint } );
      return response.data;
    } catch ( error: any ) {
      const axiosErr = error as AxiosError;
      const errorRes = axiosErr.response?.data as any;
      const errorMsg = errorRes?.message || 'An unexpected error occurred';
      notify( errorMsg );

      throw new Error( errorMsg );
    }
  };

  return (
    <RestRequestContext.Provider
      value={ { restReq, requestUrl, tryRequest, proxyApiRequest, nonceHeader } }>
      { children }
    </RestRequestContext.Provider>
  );
}
