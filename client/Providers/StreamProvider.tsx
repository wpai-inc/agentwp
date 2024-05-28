import { createContext, useContext, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Abilities } from '@wpai/schemas';
import { useUserRequests } from './UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';
export const StreamContext = createContext< any | undefined >( undefined );

export function useStream() {
  const stream = useContext( StreamContext );
  if ( stream === undefined ) {
    throw new Error( 'useStream must be used within a StreamProvider' );
  }
  return stream;
}

type AgentAction = {
  id: string;
  ability: Abilities;
  action: any;
};

export default function StreamProvider( { children }: { children: React.ReactNode } ) {
  const [ liveAction, setLiveAction ] = useState< AgentAction | null >( null );
  const [ streamClosed, setStreamClosed ] = useState( true );
  const [ streamCompleted, setStreamCompleted ] = useState( false );
  const { setCurrentUserRequestId, setCurrentAction } = useUserRequests();
  const { addErrors } = useError();
  const client = useClient();
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
        async onopen( response ) {
          if ( response.status > 300 ) {
            closeStream();
            addErrors(['Oops, something went wrong.']);
          }
        },
        onmessage( ev ) {
          if ( ev.event === 'close' ) {
            closeStream();
            setStreamCompleted( true );
          } else if ( ev.event === 'error' ) {
            closeStream();
            addErrors(['Oops, something went wrong.']);
          } else {
            setLiveAction( JSON.parse( ev.data ) as AgentAction );
          }
        },
        onerror( err ) {
          closeStream();
          throw err;
        },
        onclose: closeStream,
        signal: ctrl.signal,
        openWhenHidden: true,
      } );
    } catch ( e ) {
      console.error( 'Error starting stream', e );
      closeStream();
    }
  }

  async function startStreamFromRequest( user_request_id: string ) {
    const url = client.getStreamUrl( user_request_id );
    await startStream( url, user_request_id );
  }

  function resetStream() {
    setStreamClosed( false );
    setLiveAction( null );
  }

  function closeStream() {
    setStreamClosed( true );
    setCurrentUserRequestId( null );
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
