import { createContext, useContext, useState } from 'react';
export const ClientContext = createContext< any | undefined >( undefined );
import AwpClient from '@/Services/AwpClient';
import { usePage } from '@/Providers/PageProvider';
import { useError } from '@/Providers/ErrorProvider';
import { HistoryData } from '@/Types/types';
import type { Setting } from '@/Page/Admin/Chat/Settings/ChatSettings';
import type { AccountSetting } from '@/Types/types';
import { useNotifications } from './NotificationProvider';

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
  const { notify } = useNotifications();

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

  async function updateSetting(
    name: string,
    value: any,
    settings: Setting[],
    onBefore: ( settings: Setting[] ) => void,
    onFailure: ( settings: Setting[] ) => void,
  ) {
    const updatedSettings = settings.map( setting =>
      name === setting.name ? { ...setting, value } : setting,
    );

    await tryRequest(
      async () => {
        return await client.updateSetting( name, value );
      },
      settings,
      () => onBefore( updatedSettings ),
      () => onFailure( settings ),
    );
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

  async function optimisitc(
    fn: () => Promise< any >,
    onSuccess?: () => void,
    onFailure?: ( e: any, msg: string ) => void,
  ) {
    onSuccess && onSuccess();

    try {
      return await fn();
    } catch ( e: any ) {
      const msg = e.msg || 'An error occurred';
      onFailure && onFailure( e, msg );
    }
  }

  async function tryRequest(
    fn: () => Promise< any >,
    onSuccess?: () => void,
    onFailure?: ( e: any, msg: string ) => void,
  ) {
    const catchFailures = ( e: any, msg: string ) => {
      notify.error( msg );
      displayError( e, msg );
      onFailure && onFailure( e, msg );
    };

    return await optimisitc( fn, onSuccess, catchFailures );
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
      } }>
      { children }
    </ClientContext.Provider>
  );
}
