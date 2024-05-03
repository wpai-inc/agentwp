import React, { useState, createContext, useContext, useEffect } from 'react';
import useAwpClient from '@/Hooks/useAwpClient';
import { MessageAction, NavigateAction } from '@wpai/schemas';

export type ActionType = NavigateAction | MessageAction;

export type AgentAction = {
  id: string;
  action: ActionType;
  final: boolean;
  recipe_idx: number;
  result: any;
};

export type UserRequestType = {
  id: string;
  message: string;
  wp_user_id?: number;
  created_at?: string;
  agent_actions: AgentAction[];
};

type UserRequestsContextType = {
  conversation: UserRequestType[];
  setConversation: React.Dispatch<React.SetStateAction<UserRequestType[]>>;
  currentUserRequestId: string | null;
  setCurrentUserRequestId: React.Dispatch<React.SetStateAction<string>>;
  currentAction: AgentAction | null;
};

const UserRequestsContext = createContext<UserRequestsContextType>({
  conversation: [],
  setConversation: () => {},
  currentUserRequestId: null,
  setCurrentUserRequestId: () => {},
  currentAction: null,
});

export function useUserRequests() {
  const chat = useContext(UserRequestsContext);
  if (!chat) {
    throw new Error(
      'useUserRequests must be used within a UserRequestsProvider',
    );
  }
  return chat;
}

export default function UserRequestsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteId = '9be4d289-ec6a-429e-9ae8-b673befcab77';
  const token =
    'eyJpdiI6Im5ZQzJ3U3FkUmpscUpjeE9yMVJjbWc9PSIsInZhbHVlIjoiRDVDc3RtOGVpRXJDVnBTR2Z5OC9PUi82TWZUbGR0enpNNlRJN05Pb1I3V3lrV01xa3l1OG9RMnkyTnRXNEtFTUoyYkZqaC9GQ1duL0R2Um5yOWdQcGc9PSIsIm1hYyI6IjJiNmJmMzM0MTNlY2RlNDYwZWRmZThmZWY3MDc1NmYzMjgxYjI2NzZkMGI1MGIzODlkYWY1Yzg4MmMyN2Y2NWEiLCJ0YWciOiIifQ==';

  const [conversation, setConversation] = useState<UserRequestType[]>([]);
  const [currentUserRequestId, setCurrentUserRequestId] = useState<
    string | null
  >(null);
  const [currentAction, setCurrentAction] = useState<AgentAction | null>(null);

  useEffect(() => {
    getConversation();
  }, []);

  useEffect(() => {
    const currentRequest: UserRequestType | undefined = conversation.find(
      (request) => request.id === currentUserRequestId,
    );

    const currentAction: AgentAction | null =
      currentRequest?.agent_actions[currentRequest?.agent_actions.length - 1] ??
      null;

    setCurrentAction(currentAction);
  }, [currentUserRequestId]);

  async function getConversation() {
    const awpClient = useAwpClient(token);
    const response = await awpClient.getConversation(siteId);
    setCurrentUserRequestId(response.data[response.data.length - 1].id);
    setConversation(response.data);
  }

  return (
    <UserRequestsContext.Provider
      value={{
        conversation,
        setConversation,
        currentUserRequestId,
        setCurrentUserRequestId,
        currentAction,
      }}
    >
      {children}
    </UserRequestsContext.Provider>
  );
}
