import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useUserRequests } from './UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { AgentAction } from '@/Providers/UserRequestsProvider';
import { useError } from '@/Providers/ErrorProvider';
import { usePage } from '@/Providers/PageProvider';
import { useScreen } from '@/Providers/ScreenProvider';
import { StreamingStatusEnum } from '@/Types/enums';

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
  const update = useCallback( () => {
    setTick( tick => tick + 1 );
  }, [] );
  return update;
};

export default function StreamProvider( { children }: { children: React.ReactNode } ) {
  const { screen } = useScreen();
  const forceUpdate = useForceUpdate();
  const liveAction = useRef< AgentAction | null >( null );
    const [ retries, setRetries ] = useState< number >( -1 );
  const {
    setCurrentUserRequestId,
    addActionToCurrentRequest,
    setRequestAborted,
    currentUserRequestId,
  } = useUserRequests();
  const { addErrors } = useError();
  const { client, getStreamUrl } = useClient();
  const { page } = usePage();
  const ctrl = useRef< AbortController >( new AbortController() );
  const [ streamingStatus, setStreamingStatus ] = useState( StreamingStatusEnum.OFF );
  const latestStreamingStatus = useRef( StreamingStatusEnum.OFF );

  async function startStream( user_request_id: string ) {
    if ( latestStreamingStatus.current >= StreamingStatusEnum.SHOULD_ABORT ) {
      setStreamingStatus( StreamingStatusEnum.ABORT );
      return;
    }
    setStreamingStatus( StreamingStatusEnum.PENDING );
    forceUpdate();

    const stream_url = getStreamUrl( user_request_id );
    setCurrentUserRequestId( user_request_id );
    liveAction.current = null;

    if ( retries > 2 ) {
      addErrors( [ 'Too many retries.' ] );
      setRetries( -1 );
      return;
    }

    try {
      setRetries( retries => retries + 1 );
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
        onclose: () => {
          setStreamingStatus( StreamingStatusEnum.OFF );
        },
        async onopen( response ) {
          if ( latestStreamingStatus.current >= StreamingStatusEnum.SHOULD_ABORT ) {
            setStreamingStatus( StreamingStatusEnum.ABORT );
          } else {
            setStreamingStatus( StreamingStatusEnum.STREAMING );
          }
          if ( response.status > 300 ) {
            let body = await response.json();
            throw new Error( body?.message ?? 'Unknown error' );
          }
        },
        onmessage( ev ) {
          if ( ev.event === 'error' ) {
            let aar = JSON.parse( ev.data );
            throw new Error( `Error when processing message: ${ aar.reason }` );
          }
          if ( ev.event === 'close' && liveAction.current ) {
            addActionToCurrentRequest( user_request_id, liveAction.current );
            // setStreamClosed( true );
            setStreamingStatus( StreamingStatusEnum.OFF );
            return;
          }

          let aa = JSON.parse( ev.data ) as AgentAction;
          liveAction.current = aa;
          forceUpdate();
        },
        onerror( err ) {
          console.log( 'Stream error' );
          setStreamingStatus( StreamingStatusEnum.OFF );
          throw err;
        },
      } );
    } catch ( e ) {
      await handleStreamError( e );
      setStreamingStatus( StreamingStatusEnum.OFF );
      //   setStreamClosed( true );
    }
  }

  function cancelStream( userRequestId: string ) {
    if ( currentUserRequestId === userRequestId ) {
      if ( latestStreamingStatus.current >= StreamingStatusEnum.STREAMING ) {
        setStreamingStatus( StreamingStatusEnum.ABORT );
      } else {
        setStreamingStatus( StreamingStatusEnum.SHOULD_ABORT );
      }
    }
  }

  async function abortRequest( userRequestId: string ) {
    setRequestAborted( userRequestId );
    await client.abortUserRequest( userRequestId );
    setStreamingStatus( StreamingStatusEnum.OFF );
  }

  async function handleStreamError( e: any ) {
    console.error( 'Stream error', e );
    addErrors( [ e ] );
  }

  useEffect( () => {
    latestStreamingStatus.current = streamingStatus;
  }, [ streamingStatus ] );

  useEffect( () => {
    console.log(
      'streamingStatus',
      latestStreamingStatus.current,
      new Date().toLocaleTimeString(),
    );
    if ( streamingStatus >= StreamingStatusEnum.SHOULD_ABORT ) {
      liveAction.current = null;
    }
    if ( streamingStatus === StreamingStatusEnum.ABORT ) {
      ctrl.current.abort();
      ctrl.current = new AbortController();
      if ( currentUserRequestId ) {
        abortRequest( currentUserRequestId );
      }
    }
  }, [ streamingStatus, currentUserRequestId ] );

  return (
    <StreamContext.Provider
      value={ {
        startStream,
        cancelStream,
        liveAction: liveAction.current,
        streamingStatus,
        setStreamingStatus,
      } }>
      { children }
    </StreamContext.Provider>
  );
}
