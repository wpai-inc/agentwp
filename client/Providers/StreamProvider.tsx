import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useUserRequests } from './UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { AgentAction } from '@/Providers/UserRequestsProvider';
import { useError } from '@/Providers/ErrorProvider';
import { usePage } from '@/Providers/PageProvider';
import { useScreen } from '@/Providers/ScreenProvider';

export const StreamContext = createContext< any | undefined >( undefined );

export function useStream() {
  const stream = useContext( StreamContext );
  if ( stream === undefined ) {
    throw new Error( 'useStream must be used within a StreamProvider' );
  }
  return stream;
}

const useForceUpdate = () => {
  const [ , setTick ] = useState( 0 );
  return useCallback( () => {
    setTick( tick => tick + 1 );
  }, [] );
};

export default function StreamProvider( { children }: { children: React.ReactNode } ) {
  const { screen } = useScreen();
  const forceUpdate = useForceUpdate();
  const liveAction = useRef< AgentAction | null >( null );
  const [ streamClosed, setStreamClosed ] = useState( true );
  const { setCurrentUserRequestId, addActionToCurrentRequest, currentUserRequestId } =
    useUserRequests();
  const { addErrors } = useError();
  const { client } = useClient();
  const { page } = usePage();
  const ctrl = useRef< AbortController >( new AbortController() );

  async function startStream( stream_url: string, user_request_id: string ) {
    setCurrentUserRequestId( user_request_id );
    resetStream();

    try {
      await fetchEventSource( stream_url, {
        method: 'POST',
        body: JSON.stringify( { screen } ),
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + client.token,
          'X-WP-AGENT-VERSION': client.agentWpVersion,
          'X-Wp-Agent-Version': client.agentWpVersion,
          'X-Wp-User-Id': page.user.ID,
          'X-Wp-Site-Id': page.site_id,
          'Content-Type': 'application/json',
        },
        signal: ctrl.current.signal,
        openWhenHidden: true,
        onclose: () => setStreamClosed( true ),
        async onopen( response ) {
          if ( response.status > 300 ) {
            let body = await response.json();
            throw new Error( body?.message ?? 'Unknown error' );
          }
        },
        onmessage( ev ) {
          if ( ev.event === 'error' ) {
            let aar = JSON.parse( ev.data );
            throw new Error( `Error when processing message: ${ aar }` );
          }
          if ( ev.event === 'close' && liveAction.current ) {
            addActionToCurrentRequest( user_request_id, liveAction.current );
            setStreamClosed( true );
            return;
          }

          liveAction.current = JSON.parse( ev.data ) as AgentAction;
          forceUpdate();
        },
        onerror( err ) {
          throw err;
        },
      } );
    } catch ( e ) {
      await handleStreamError( e );
      setStreamClosed( true );
    }
  }

  async function cancelStream() {
    // Abbort the connection
    ctrl.current.abort();

    // Reset the controller
    ctrl.current = new AbortController();
    setStreamClosed( true );
    client.abortUserRequest( currentUserRequestId );
  }

  async function startStreamFromRequest( user_request_id: string ) {
    const url = client.getStreamUrl( user_request_id );
    await startStream( url, user_request_id );
  }

  async function handleStreamError( e: any ) {
    console.error( 'Stream error', e );
    addErrors( [ e.message ] );
  }

  function resetStream() {
    setStreamClosed( false );
    liveAction.current = null;
  }

  return (
    <StreamContext.Provider
      value={ {
        startStream,
        cancelStream,
        startStreamFromRequest,
        liveAction: liveAction.current,
        streamClosed,
      } }>
      { children }
    </StreamContext.Provider>
  );
}
