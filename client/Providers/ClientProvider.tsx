import { createContext, useContext, useState } from 'react';
export const ClientContext = createContext< any | undefined >( undefined );
import AwpClient from '@/Services/AwpClient';
import { usePage } from '@/Providers/PageProvider';
import { useError } from '@/Providers/ErrorProvider';
import { HistoryData } from '@/Types/types';

export function useClient() {
  const client = useContext( ClientContext );
  if ( client === undefined ) {
    throw new Error( 'useClient must be used within a ClientProvider' );
  }
  return client;
}

type ErrorType = {
  message: string;
};

export function ClientProvider( { children }: { children: React.ReactNode } ) {
  const { page } = usePage();
  const { addErrors } = useError();
  const [ tryingRequest, setTryingRequest ] = useState< boolean >( false );
  const [ requestError, setRequestError ] = useState< boolean >( false );

  const userProfileUrl = page.api_host + '/dashboard';

  async function getHistory( since?: string ): Promise< HistoryData[] > {
    return tryRequest( async () => {
      const response = await client.getHistory( since );
      return response.data as HistoryData[];
    } );
  }

  async function clearConversation() {
    return tryRequest( async () => {
      await client.clearConversation();
    } );
  }

  async function unclearConversation( since: string ) {
    return tryRequest( async () => {
      await client.unclearConversation( since );
    } );
  }

  async function updateSetting( name: string, value: any ) {
    return tryRequest( async () => {
      const response = await client.updateSetting( name, value );
      return response.data;
    } );
  }

  async function getSettings() {
    return tryRequest( async () => {
      const response = await client.getSettings();
      return response.data;
    } );
  }

  async function getConversation( since?: string ) {
    return tryRequest( async () => {
      const res = await client.isAuthorized()?.getConversation( since );
      return res?.data?.data;
    } );
  }

  async function getSuggestions( pageCtx?: any ) {
    return tryRequest( async () => {
      const res = await client.isAuthorized()?.getSuggestions( pageCtx );
      return res?.data;
    } );
  }

  async function tryRequest(
    fn: () => Promise< any >,
    defaultValue: any = [],
    failureMsg?: string,
  ) {
    setRequestError( false );
    setTryingRequest( true );

    try {
      const req = await fn();
      setTryingRequest( false );
      return req;
    } catch ( e: any ) {
      const msg = failureMsg || "We're having trouble connecting to your account.";
      displayError( e, msg );
      setTryingRequest( false );
      setRequestError( true );
      return defaultValue;
    }
  }

  function displayError( e: ErrorType, msg: string ): [] {
    addErrors( [ msg ] );
    console.error( e );
    return [];
  }

  const client = new AwpClient( page.access_token ).setBaseUrl( page.api_host );
  return (
    <ClientContext.Provider
      value={ {
        client,
        getHistory,
        getConversation,
        getSuggestions,
        clearConversation,
        unclearConversation,
        userProfileUrl,
        getSettings,
        updateSetting,
        tryingRequest,
        requestError,
      } }>
      { children }
    </ClientContext.Provider>
  );
}
