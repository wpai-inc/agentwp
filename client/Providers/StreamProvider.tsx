import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Abilities } from '@wpai/schemas';
import { useUserRequests } from './UserRequestsProvider';
import useAwpClient from '@/Hooks/useAwpClient';
export const StreamContext = createContext<any | undefined>(undefined);

export function useStream() {
  const stream = useContext(StreamContext);
  if (stream === undefined) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return stream;
}

type AgentAction = {
  id: string;
  ability: Abilities;
  action: any;
};

export default function StreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [liveAction, setLiveAction] = useState<AgentAction | null>(null);
  const [action, setAction] = useState<AgentAction | null>(null);
  const [streamClosed, setStreamClosed] = useState(true);
  const { setCurrentUserRequestId, currentUserRequestId, currentAction } =
    useUserRequests();
  const client = useAwpClient();
  const ctrl = new AbortController();

  async function startStream(stream_url: string, user_request_id: string) {
    console.log('startstream');
    setCurrentUserRequestId(user_request_id);
    resetStream();
    try {
      await fetchEventSource(stream_url, {
        credentials: 'include',
        async onopen(response) {
          if (response.status === 500) {
            console.error('Server Error: HTTP 500');
            closeStream();
            return; // Prevents the stream from continuing when a 500 error is encountered
          }
        },
        onmessage(ev) {
          setLiveAction({
            id: ev.id,
            ability: ev.event,
            action: JSON.parse(ev.data),
          } as AgentAction);
        },
        onerror(err) {
          closeStream();
          throw err;
        },
        onclose: closeStream,
        signal: ctrl.signal,
        openWhenHidden: true,
      });
    } catch (e) {
      console.error('Error starting stream', e);
      closeStream();
    }
  }

  useEffect(() => {
    if (!currentAction?.final && currentUserRequestId) {
      startStreamFromRequest(currentUserRequestId);
    }
  }, [currentAction, currentUserRequestId]);

  async function startStreamFromRequest(user_request_id: string) {
    const url = client.getStreamUrl(user_request_id);
    await startStream(url, user_request_id);
  }

  function resetStream() {
    setStreamClosed(false);
    setAction(null);
    setLiveAction(null);
  }

  function closeStream() {
    setStreamClosed(true);
    setAction(liveAction);
  }

  return (
    <StreamContext.Provider
      value={{
        startStream,
        startStreamFromRequest,
        action,
        liveAction,
        streamClosed,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
