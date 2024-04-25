import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from './ClientSettingsProvider';
import axios from 'axios';
import { useScreen } from './ScreenProvider';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { MessageType } from '@/Components/Convo/Message';
import { MessageAction } from '@wpai/schemas';

type CreateUserRequestResponse = {
  user_request_id: string;
  stream_url: string;
};

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
  const siteId = '9be4d289-ec6a-429e-9ae8-b673befcab77';
  const wp_user_id = 1;
  const token =
    'eyJpdiI6Im5ZQzJ3U3FkUmpscUpjeE9yMVJjbWc9PSIsInZhbHVlIjoiRDVDc3RtOGVpRXJDVnBTR2Z5OC9PUi82TWZUbGR0enpNNlRJN05Pb1I3V3lrV01xa3l1OG9RMnkyTnRXNEtFTUoyYkZqaC9GQ1duL0R2Um5yOWdQcGc9PSIsIm1hYyI6IjJiNmJmMzM0MTNlY2RlNDYwZWRmZThmZWY3MDc1NmYzMjgxYjI2NzZkMGI1MGIzODlkYWY1Yzg4MmMyN2Y2NWEiLCJ0YWciOiIifQ==';

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
    const response = await axios.get(`http://localhost/api/sites/${siteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const response = await axios.post(
      `http://localhost/api/sites/${siteId}`,
      { message, wp_user_id, screen },
      { headers: { Authorization: `Bearer ${token}` } },
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
