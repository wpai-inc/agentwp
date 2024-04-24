import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from './ClientSettingsProvider';
import axios from 'axios';
import { useScreen } from './ScreenProvider';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { MessageType } from '@/Components/Convo/Message';

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
  const siteId = '9bd7360f-6aeb-4204-b1a6-624d004701a3';
  const wp_user_id = 1;
  const token = `eyJpdiI6InYrRXJBOHdWd0ovVGpabXBpRUdhaVE9PSIsInZhbHVlIjoiQnFLWC9ka0xCNHEycWZBbjN1MzQ5SkZxVmZic2UxTEtwQzdGQTk2aWIvMTVoU3N1b0RmVE13TDkvd3JNYmNTV1VYWXY2bnF1WU9mTEo0VkdnT2tmUmc9PSIsIm1hYyI6ImIzZGUwMWYyNzRmZGZjYTMzZjZjNjRiMzI0OTVlNTM5Y2RlM2Q4ZGY0ZWEwNTJhN2YxZjQxZGRlZTc3OTdlNmIiLCJ0YWciOiIifQ==`;

  const screen = useScreen();
  const { settings, setSettings } = useClientSettings();
  const [open, setOpen] = useState(settings.chatOpen ?? false);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  useEffect(() => {
    if (open) {
      getConversation();
    }
  }, [open]);

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

    response.data.forEach((userRequest: any) => {
      let messages: MessageType[] = [];

      messages = [
        ...messages,
        {
          id: userRequest.id,
          role: 'user',
          content: userRequest.message,
        }
      ];

      if (userRequest.agent_actions) {
        const agentMessages: MessageType[] = userRequest.agent_actions.map(
          (agentAction: any) => {
            return {
              id: agentAction.id,
              role: 'agent',
              content: agentAction.action,
            };
          }
        );

        messages = [...messages, ...agentMessages];
      }

      setConversation((prev) => [...prev, ...messages]);
    });
  }

  async function userRequest(
    message: string,
  ): Promise<CreateUserRequestResponse> {
    const response = await axios.post(
      `http://localhost/api/sites/${siteId}`,
      {
        message,
        wp_user_id,
        screen,
      },
      // bearer token
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
        const data = JSON.parse(ev.data);
        updateMessage({
          id: ev.id,
          role: 'agent',
          content: data.text,
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
