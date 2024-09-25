import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useUserRequests } from './UserRequestsProvider';
import { AgentAction } from '@/Providers/UserRequestsProvider';
import { useError } from '@/Providers/ErrorProvider';
import { useScreen } from '@/Providers/ScreenProvider';
import { StreamingStatusEnum } from '@/Types/enums';
import { useRestRequest } from './RestRequestProvider';

export type StreamRequestType = App.Data.Response.StoreUserRequestData & { access_token: string };

type StreamContextType = {
  startStream: ( data: StreamRequestType ) => Promise< void >;
  retryStream: ( userRequestId: string ) => Promise< void >;
  cancelStream: ( userRequestId: string ) => void;
  liveAction: AgentAction | null;
  streamingStatus: StreamingStatusEnum;
  setStreamingStatus: ( status: StreamingStatusEnum ) => void;
};

export const StreamContext = createContext< StreamContextType | undefined >( undefined );

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
  const { apiRequest, tryRequest } = useRestRequest();
  const ctrl = useRef< AbortController >( new AbortController() );
  const [ streamingStatus, setStreamingStatus ] = useState( StreamingStatusEnum.OFF );
  const latestStreamingStatus = useRef( StreamingStatusEnum.OFF );

  async function startStream( {
    user_request,
    stream_url,
    access_token,
    site_id,
    wp_user_id,
  }: StreamRequestType ) {
    if ( latestStreamingStatus.current >= StreamingStatusEnum.SHOULD_ABORT ) {
      setStreamingStatus( StreamingStatusEnum.ABORT );
      return;
    }
    setStreamingStatus( StreamingStatusEnum.PENDING );
    setCurrentUserRequestId( user_request.id );
    liveAction.current = null;

    if ( retries > 2 ) {
      addErrors( [ 'Too many retries.' ] );
      setRetries( -1 );
      setStreamingStatus( StreamingStatusEnum.OFF );
      return;
    }

    try {
      setRetries( retries => retries + 1 );
      await fetchEventSource( stream_url, {
        method: 'POST',
        body: JSON.stringify( { userRequest: user_request.id, screen } ),
        headers: {
          'Accept': 'text/event-stream',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ access_token }`,
          'X-Wp-Site-Id': site_id,
          'X-Wp-User-Id': wp_user_id.toString(),
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
            addActionToCurrentRequest( user_request.id, liveAction.current );
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
    await apiRequest< App.Data.UserRequestData >( 'requestAbort', { userRequest: userRequestId } );
    setStreamingStatus( StreamingStatusEnum.OFF );
  }

  async function handleStreamError( e: any ) {
    console.error( 'Stream error', e );
    addErrors( [ e ] );
  }

  async function retryStream( userRequestId: string ) {
    const { data } = await tryRequest< StreamRequestType >( 'post', 'retry_request', {
      userRequest: userRequestId,
    } );

    await startStream( data );
  }

  useEffect( () => {
    latestStreamingStatus.current = streamingStatus;
  }, [ streamingStatus ] );

  useEffect( () => {
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
        retryStream,
        cancelStream,
        liveAction: liveAction.current,
        streamingStatus,
        setStreamingStatus,
      } }>
      { children }
    </StreamContext.Provider>
  );
}
