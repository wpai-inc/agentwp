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
  const { since } = useUserRequests();
  const forceUpdate = useForceUpdate();
  const liveAction = useRef< AgentAction | null >( null );
  const {
    setCurrentUserRequestId,
    addActionToCurrentRequest,
    setRequestAborted,
    currentUserRequestId,
  } = useUserRequests();
  const { addErrors } = useError();
  const { proxyApiRequest, tryRequest } = useRestRequest();
  const ctrl = useRef< AbortController >( new AbortController() );
  const [ streamingStatus, setStreamingStatus ] = useState( StreamingStatusEnum.OFF );
  const latestStreamingStatus = useRef( StreamingStatusEnum.OFF );

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

  function resetStream( ur: App.Data.UserRequestData ) {
    setStreamingStatus( StreamingStatusEnum.PENDING );
    setCurrentUserRequestId( ur.id );
    liveAction.current = null;
  }

  function closeStream( ur: App.Data.UserRequestData ) {
    if ( liveAction.current ) {
      addActionToCurrentRequest( ur.id, liveAction.current );
    }

    setStreamingStatus( StreamingStatusEnum.OFF );
  }

  function actionTick( aa: AgentAction ) {
    liveAction.current = aa;
    forceUpdate();
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
    await proxyApiRequest< App.Data.UserRequestData >( 'requestAbort', {
      userRequest: userRequestId,
    } );
    setStreamingStatus( StreamingStatusEnum.OFF );
  }

  async function retryStream( userRequestId: string ) {
    const { data } = await tryRequest< StreamRequestType >( 'post', 'retry_request', {
      userRequest: userRequestId,
    } );

    await startStream( data );
  }

  function checkAbortion(): boolean {
    if ( latestStreamingStatus.current >= StreamingStatusEnum.SHOULD_ABORT ) {
      setStreamingStatus( StreamingStatusEnum.ABORT );
      return true;
    } else {
      setStreamingStatus( StreamingStatusEnum.STREAMING );
      return false;
    }
  }

  async function startStream( {
    user_request,
    stream_url,
    access_token,
    site_id,
    wp_user_id,
  }: StreamRequestType ) {
    if ( checkAbortion() ) {
      return;
    }

    resetStream( user_request );

    try {
      await fetchEventSource( stream_url, {
        method: 'POST',
        body: JSON.stringify( {
          userRequest: user_request.id,
          screen,
          since: since || null,
        } ),
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
          checkAbortion();
          if ( response.status > 300 ) {
            let body = await response.json();
            if ( body?.action_txt && body?.action_url ) {
              throw new Error( JSON.stringify( body ) );
            } else {
              throw new Error( body?.message ?? 'Unknown error' );
            }
          }
        },
        onmessage( ev ) {
          if ( ev.event === 'error' ) {
            let aar = JSON.parse( ev.data );
            throw new Error( `Error when processing message: ${ aar.reason }` );
          }

          if ( ev.event === 'close' ) {
            closeStream( user_request );
          } else {
            let aa = JSON.parse( ev.data ) as AgentAction;
            actionTick( aa );
          }
        },
        onerror( err ) {
          throw err;
        },
      } );
    } catch ( e: any ) {
      console.error( 'Stream error', e );
      setStreamingStatus( StreamingStatusEnum.ERROR );
      addErrors( [ e ] );
    }
  }

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
