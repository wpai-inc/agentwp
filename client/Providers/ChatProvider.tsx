import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from './ClientSettingsProvider';
import { useScreen } from './ScreenProvider';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { MessageType } from '@/Components/Convo/Message';
import { MessageAction } from '@wpai/schemas';
import apiRequest from "@/lib/apiRequest";

type CreateUserRequestResponse = {
  user_request_id: string;
  stream_url: string;
};

declare const agentwp_settings: agentwpSettings;


const ChatContext = createContext({
  open: false,
  setOpen: (_open: boolean) => {},
  toggle: () => {},
  conversation: [] as MessageType[],
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
  const screen = useScreen();
  const { settings, setSettings } = useClientSettings();
  const [open, setOpen] = useState(settings.chatOpen ?? false);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  useEffect(() => {
    getConversation();
  }, []);

  function toggle() {
    const newVal = !open;
    setOpen(newVal);
    setSettings({ chatOpen: newVal });
  }

  async function getConversation() {
    const response = await apiRequest.get( `/api/sites/${agentwp_settings.site_id}`);

    const messages = response.data.reduce(
      (acc: MessageType[], userRequest: any) => {
        const userMessage = {
          id: userRequest.id,
          role: 'user',
          content: userRequest.message,
        };

        const agentMessages = userRequest.agent_actions
          ? userRequest.agent_actions.map((agentAction: any) => ({
              id: agentAction.id,
              role: 'agent',
              content: agentAction.action,
            }))
          : [];

        return [...acc, userMessage, ...agentMessages];
      },
      [],
    );

    setConversation(messages);
  }

  async function userRequest(
    message: string,
  ): Promise<CreateUserRequestResponse> {
    const response = await apiRequest.post(
      `/api/sites/${agentwp_settings.site_id}`,
      { message, screen },
    );

    return response.data;
  }

  /**
   * Adds or updates a msg in the conversation
   * @param msg
   * @returns void
   */
  function updateMessage(msg: MessageType) {
    setConversation((prev) => {
      const index = prev.findIndex((m) => m.id === msg.id);
      if (index !== -1) {
        prev[index] = msg;
        return [...prev];
      } else {
        return [...prev, msg];
      }
    });
  }

  async function sendMessage(message: string) {
    const { stream_url, user_request_id } = await userRequest(message);
    const msg: MessageType = {
      id: user_request_id,
      role: 'user',
      content: message,
    };

    updateMessage(msg);

    await fetchEventSource(stream_url, {
      onmessage(ev) {
        const data = JSON.parse(ev.data) as MessageAction;
        updateMessage({
          id: ev.id,
          role: 'agent',
          content: data,
        });
      },
    });
  }

  return (
    <ChatContext.Provider
      value={{ open, setOpen, toggle, conversation, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}
