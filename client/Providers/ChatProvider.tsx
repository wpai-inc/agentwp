import React, { useState, createContext, useContext } from 'react';

const ChatContext = createContext({
  open: false,
  setOpen: (_open: boolean) => {},
  toggle: () => {},
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
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  return (
    <ChatContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </ChatContext.Provider>
  );
}
