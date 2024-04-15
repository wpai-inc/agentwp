import React, { useState, createContext, useContext } from 'react';
import { useClientSettings } from './ClientSettingsProvider';

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

  function sendMessage(message: string) {
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
