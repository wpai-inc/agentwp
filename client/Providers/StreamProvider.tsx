import { createContext, useContext, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Abilities } from '@wpai/schemas';

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

  async function startStream(stream_url: string) {
    resetStream();
    try {
      await fetchEventSource(stream_url, {
        onmessage(ev) {
          setLiveAction({
            id: ev.id,
            ability: ev.event,
            action: JSON.parse(ev.data),
          } as AgentAction);
        },
        onerror: closeStream,
        onclose: closeStream,
      });
    } catch (e) {
      console.error('Error starting stream', e);
      closeStream();
    }
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
      value={{ startStream, action, liveAction, streamClosed }}
    >
      {children}
    </StreamContext.Provider>
  );
}
