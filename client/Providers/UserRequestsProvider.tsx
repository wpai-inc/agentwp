import React, { useState, createContext, useContext, useEffect } from 'react';
import { useClient } from '@/Providers/ClientProvider';
import { MessageAction, NavigateAction } from '@wpai/schemas';
import { usePage } from './PageProvider';

export type ActionType = NavigateAction | MessageAction;

export type AgentAction = {
  id: string;
  action: ActionType;
  final: boolean;
  recipe_idx: number;
  result: any;
  hasExecuted: boolean;
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
  setCurrentUserRequestId: React.Dispatch<React.SetStateAction<string | null>>;
  currentAction: AgentAction | null;
  setCurrentAction: (action: AgentAction | null) => void;
};

const UserRequestsContext = createContext<UserRequestsContextType>({
  conversation: [],
  setConversation: () => {},
  currentUserRequestId: null,
  setCurrentUserRequestId: () => {},
  currentAction: null,
  setCurrentAction: () => {},
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

declare const agentwp_settings: agentwpSettings;

export default function UserRequestsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const page = usePage();
  const siteId = page.site_id;
  const client = useClient();

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

    const currentAction: AgentAction | null = currentRequest?.agent_actions
      ? currentRequest?.agent_actions[currentRequest?.agent_actions.length - 1]
      : null;

    setCurrentAction(currentAction);
  }, [currentUserRequestId, conversation]);

  async function getConversation() {
    const response = await client.getConversation(siteId);
    if (response.data.length > 0) {
      setCurrentUserRequestId(response.data[response.data.length - 1]?.id);
      setConversation(response.data);
    }
  }

  return (
    <UserRequestsContext.Provider
      value={{
        conversation,
        setConversation,
        currentUserRequestId,
        setCurrentUserRequestId,
        currentAction,
        setCurrentAction,
      }}
    >
      {children}
    </UserRequestsContext.Provider>
  );
}
