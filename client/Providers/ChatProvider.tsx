import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClientSettings } from '@/Providers/ClientSettingsProvider';
import { useScreen } from '@/Providers/ScreenProvider';
import { useStream } from '@/Providers/StreamProvider';
import type { MessageType } from '@/Components/Convo/Message';
import useAwpClient from '@/Hooks/useAwpClient';

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
  const siteId = '9bf34f11-304c-42c8-8b80-54b6628fe151';
  const wp_user_id = 1;
  const token =
    'eyJpdiI6Imc3bnJaM3RrN2tBYmREd3lMQlpIVUE9PSIsInZhbHVlIjoiNXM1T1ZpbGZpV0ZpZVBQK3VUYThKUDZYR2ZIQkpxa2RkUVVrZXZzZnBtQ1NBeWtNTU53STlwQWJJVGttVVh0Tk1WTUVZY1VtWHBXcHdvaUFDcVhiUFE9PSIsIm1hYyI6ImUxNDBmMzVhYzViNGZjMmY2ZGViNzVmNmExNWJhNThlY2Q4NGU5MzA0N2ZhOGM5YjE4NzRhY2NhYzhhN2YzN2YiLCJ0YWciOiIifQ==';

  const screen = useScreen();
  const { settings, setSettings } = useClientSettings();
  const [open, setOpen] = useState(settings.chatOpen ?? false);
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const { startStream, liveAction } = useStream();

  useEffect(() => {
    getConversation();
  }, []);

  useEffect(() => {
    if (liveAction) {
      updateMessage({
        id: liveAction.id,
        role: 'agent',
        content: liveAction.action,
      });
    }
  }, [liveAction]);

  function toggle() {
    const newVal = !open;
    setOpen(newVal);
    setSettings({ chatOpen: newVal });
  }

  async function getConversation() {
    const awpClient = useAwpClient(token);
    const response = await awpClient.getConversation(siteId);

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
    const awpClient = useAwpClient(token);
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
    updateMessage({
      id: user_request_id,
      role: 'user',
      content: message,
    } as MessageType);
    startStream(stream_url);
  }

  return (
    <ChatContext.Provider
      value={{ open, setOpen, toggle, conversation, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}
