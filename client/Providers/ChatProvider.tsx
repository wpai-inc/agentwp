import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useScreen } from '@/Providers/ScreenProvider';
import { useStream } from '@/Providers/StreamProvider';
import useAwpClient from '@/Hooks/useAwpClient';
import type {
  UserRequestType,
  AgentAction,
} from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';

type CreateUserRequestResponse = {
  user_request_id: string;
  stream_url: string;
};

declare const agentwp_settings: agentwpSettings;


const ChatContext = createContext({
  open: false,
  setOpen: (_open: boolean) => {},
  toggle: () => {},
  conversation: [] as UserRequestType[],
  sendMessage: (_message: string) => {},
});

export function useChat() {
  const chat = useContext(ChatContext);
  if (!chat) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return chat;
}


export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const siteId = "9bf52c59-0edf-4495-a566-cef381e428e4";
  const wp_user_id = 1;

  const screen = useScreen();
  const { settings, setSettings } = useClientSettings();
  const [open, setOpen] = useState(settings.chatOpen ?? false);
  const { conversation, setConversation, currentUserRequestId } =
    useUserRequests();
  const { startStream, liveAction } = useStream();

  useEffect(() => {
    if (liveAction && currentUserRequestId) {
      updateAgentMessage(currentUserRequestId, liveAction);
    }
  }, [liveAction, currentUserRequestId]);

  function toggle() {
    const newVal = !open;
    setOpen(newVal);
    setSettings({ chatOpen: newVal });
  }

  async function userRequest(
    message: string,
  ): Promise<CreateUserRequestResponse> {
    const awpClient = useAwpClient();
    const response = await awpClient.storeConversation(siteId, {
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

    console.log('sending message');
    startStream(stream_url, user_request_id);
  }

  return (
    <ChatContext.Provider
      value={{ open, setOpen, toggle, conversation, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}