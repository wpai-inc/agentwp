import { createContext, useContext, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useUserRequests } from './UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { AgentAction } from '@/Providers/UserRequestsProvider';
import { useError } from '@/Providers/ErrorProvider';
export const StreamContext = createContext< any | undefined >( undefined );

export function useStream() {
  const stream = useContext( StreamContext );
  if ( stream === undefined ) {
    throw new Error( 'useStream must be used within a StreamProvider' );
  }
  return stream;
}

export default function StreamProvider( { children }: { children: React.ReactNode } ) {
  const [ liveAction, setLiveAction ] = useState< AgentAction | null >( null );
  const [ streamClosed, setStreamClosed ] = useState( true );
  const [ streamCompleted, setStreamCompleted ] = useState( false );
  const { setCurrentUserRequestId, setCurrentAction } = useUserRequests();
  const { addErrors } = useError();
  const { client } = useClient();
  const ctrl = new AbortController();

  async function startStream( stream_url: string, user_request_id: string ) {
    setCurrentUserRequestId( user_request_id );

    resetStream();

    try {
      await fetchEventSource( stream_url, {
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + client.token,
          'X-WP-AGENT-VERSION': client.agentWpVersion,
        },
        signal: ctrl.signal,
        openWhenHidden: true,
        onclose: closeStream,
        async onopen( response ) {
          if ( response.status > 300 ) {
            throw new Error( `Server responded with: ${ response.status }` );
          }
        },
        onmessage( ev ) {
          if ( ev.event === 'error' ) {
            let aar = JSON.parse( ev.data );
            throw new Error( `Error when processing message: ${ aar }` );
          }
          if ( ev.event === 'close' ) {
            setStreamCompleted( true );
            return;
          }

          let aa = JSON.parse( ev.data ) as AgentAction;
          setLiveAction( aa );
        },
        onerror( err ) {
          throw err;
        },
      } );
    } catch ( e ) {
      await handleStreamError( e );
      closeStream();
    }
  }

  async function startStreamFromRequest( user_request_id: string ) {
    const url = client.getStreamUrl( user_request_id );
    await startStream( url, user_request_id );
  }

  async function handleStreamError( e: any ) {
    console.error( 'Error starting stream', e );
    addErrors( [ 'Oops, something went wrong.' ] );
  }

  function resetStream() {
    setStreamClosed( false );
    setLiveAction( null );
  }

  function closeStream() {
    setStreamClosed( true );
    if ( streamCompleted && liveAction ) {
      setCurrentAction( liveAction );
    }
  }

  return (
    <StreamContext.Provider
      value={ {
        startStream,
        startStreamFromRequest,
        liveAction,
        streamClosed,
      } }>
      { children }
    </StreamContext.Provider>
  );
}
