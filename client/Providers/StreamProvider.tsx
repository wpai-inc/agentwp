import { createContext, useContext, useState, useEffect } from 'react';
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
  const [streamClosed, setStreamClosed] = useState(true);
  const [streamCompleted, setStreamCompleted] = useState(false);
  const { setCurrentUserRequestId, setCurrentAction } = useUserRequests();
  const client = useAwpClient();
  const ctrl = new AbortController();

  async function startStream(stream_url: string, user_request_id: string) {
    setCurrentUserRequestId(user_request_id);
    resetStream();
    try {
      await fetchEventSource(stream_url, {
        // credentials: 'include',
        async onopen(response) {
          if (response.status === 500) {
            closeStream();
            throw new Error('Server Error: HTTP 500');
          }
        },
        onmessage(ev) {
          if (ev.event === 'close') {
            closeStream();
            setStreamCompleted(true);
          } else {
            setLiveAction(JSON.parse(ev.data) as AgentAction);
          }
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

  async function startStreamFromRequest(user_request_id: string) {
    const url = client.getStreamUrl(user_request_id);
    await startStream(url, user_request_id);
  }

  function resetStream() {
    setStreamClosed(false);
    setLiveAction(null);
  }

  function closeStream() {
    setStreamClosed(true);
    if (streamCompleted && liveAction) {
      setCurrentAction(liveAction);
    }
  }

  return (
    <StreamContext.Provider
      value={{
        startStream,
        startStreamFromRequest,
        liveAction,
        streamClosed,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
