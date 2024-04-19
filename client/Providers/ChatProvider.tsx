import React, { useState, createContext, useContext } from 'react';
import { useClientSettings } from './ClientSettingsProvider';
import axios from 'axios';
import { useScreen } from './ScreenProvider';

type Message = {
  role: 'agent' | 'user';
  message: string;
};

const ChatContext = createContext({
  open: false,
  setOpen: (_open: boolean) => {},
  toggle: () => {},
  conversation: [] as Message[],
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
  console.log('screen', screen);
  const { settings, setSettings } = useClientSettings();
  const [open, setOpen] = useState(settings.chatOpen ?? false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'agent',
      message: 'Hello! How can I help you today?',
    },
    {
      role: 'user',
      message: 'I need help with my order.',
    },
    {
      role: 'agent',
      message: 'Sure! Can you provide me with your order number?',
    },
    {
      role: 'user',
      message: 'Yes, it is 123456.',
    },
  ]);

  function toggle() {
    const newVal = !open;
    setOpen(newVal);
    setSettings({ chatOpen: newVal });
  }

  async function userRequest(message: string) {
    //@todo: dynamic site ID
    const siteId = '9bd7360f-6aeb-4204-b1a6-624d004701a3';
    const wp_user_id = 1;

    const response = await axios.post(
      `http://localhost/api/sites/${siteId}/request`,
      {
        message,
        wp_user_id,
        screen,
      },
    );
    console.log(response);
    return response;
  }

  function sendMessage(message: string) {
    userRequest(message);

    setConversation((prev) => [
      ...prev,
      {
        role: 'user',
        message,
      },
    ]);
  }

  return (
    <ChatContext.Provider
      value={{ open, setOpen, toggle, conversation, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}
