import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useScreen } from '@/Providers/ScreenProvider';
import { useStream } from '@/Providers/StreamProvider';
import type {
  UserRequestType,
  AgentAction,
} from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { usePage } from '@/Providers/PageProvider';
import { useClient } from '@/Providers/ClientProvider';

type CreateUserRequestResponse = {
  user_request_id: string;
  stream_url: string;
};

const ChatContext = createContext({
  open: false,
  setOpen: (_open: boolean) => {},
  toggle: () => {},
  maximizeChatWindow: (element) => {},
  reduceWindow: () => {},
  isMaximized: false,
  minimizing: false,
  expanding: false,
  maximizing: false,
  reducing: false,
  conversation: [] as UserRequestType[],
  sendMessage: (_message: string) => {},
  openChatOverlay: (children) => {},
  closeChatOverlay: () => {},
  overlayChildren: null,
});

export function useChat() {
  const chat = useContext(ChatContext);
  if (!chat) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return chat;
}

export default function ChatProvider({
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const page = usePage();
  const siteId = page.site_id;
  const wp_user_id = parseInt(page.user.ID);
  const client = useClient();
  const screen = useScreen();
  const { settings, setSettings } = useClientSettings();
  const [open, setOpen] = useState(settings.chatOpen ?? defaultOpen);
  const [minimizing, setMinimizing] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [maximizing, setMaximizing] = useState(false);
  const [reducing, setReducing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(settings.chatMaximized ?? false);
  const [overlayChildren, setOverlayChildren] = useState(null);
  const { conversation, setConversation, currentUserRequestId } =
    useUserRequests();
  const { startStream, liveAction, error } = useStream();
  useEffect(() => {
    if (liveAction && currentUserRequestId) {
      updateAgentMessage(currentUserRequestId, liveAction);
    }
  }, [liveAction, currentUserRequestId]);

  useEffect(() => {
    if (error) {
      console.error('Stream error:', error);
    }
  }, [error]);

  function toggle() {
    const newVal = !open;
    if (newVal) {
      setExpanding(true);
    } else {
      setMinimizing(true);
    }
    setTimeout(() => {
      setOpen(newVal);
      setExpanding(false);
      setMinimizing(false);
      setIsMaximized(false);
      setSettings({
        chatOpen: newVal,
        chatMaximized: false,
        x: 0,
        y: 0,
      });
    }, 1400);
  }

  function maximizeChatWindow(chatWindowElement) {
    setMaximizing(true);
    setTimeout(() => {
      setMaximizing(false);
      setIsMaximized(true);
      chatWindowElement.style.transform = 'translate(0px, 0px)';
      setSettings({
        chatMaximized: true,
        x: 0,
        y: 0,
      });
    }, 1000);
  }

  function reduceWindow() {
    setReducing(true);
    setTimeout(() => {
      setReducing(false);
      setIsMaximized(false);
      setSettings({ chatMaximized: false });
    }, 1000);
  }

  function openChatOverlay(children) {
    setOverlayChildren(children);
  }

  function closeChatOverlay() {
    setOverlayChildren(null);
  }

  async function userRequest(
    message: string,
  ): Promise<CreateUserRequestResponse> {
    const response = await client.storeConversation(siteId, {
      message,
      wp_user_id,
      screen,
    });

    return response.data;
  }

  /**
   * Adds or updates a msg in the conversation
   * @param msg
   * @returns void
   */
  function updateAgentMessage(urId: string, updatedAa: AgentAction) {
    setConversation((prev: UserRequestType[]) => {
      return prev.map(function (msg) {
        if (msg.id === urId) {
          return {
            ...msg,
            agent_actions: msg.agent_actions
              ? msg.agent_actions.some((aa) => aa.id === updatedAa.id)
                ? msg.agent_actions.map((aa) =>
                    aa.id === updatedAa.id ? updatedAa : aa,
                  )
                : [...msg.agent_actions, updatedAa]
              : [updatedAa],
          };
        }
        return msg;
      });
    });
  }

  function addUserRequest(msg: UserRequestType) {
    setConversation([...conversation, msg]);
  }

  async function sendMessage(message: string) {
    const { stream_url, user_request_id } = await userRequest(message);
    addUserRequest({
      id: user_request_id,
      message: message,
    } as UserRequestType);

    try {
      startStream(stream_url, user_request_id);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ChatContext.Provider
      value={{
        open,
        setOpen,
        toggle,
        maximizeChatWindow,
        reduceWindow,
        isMaximized,
        maximizing,
        reducing,
        minimizing,
        expanding,
        conversation,
        sendMessage,
        openChatOverlay,
        closeChatOverlay,
        overlayChildren
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
