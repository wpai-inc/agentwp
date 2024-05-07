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
  setCurrentUserRequestId: React.Dispatch<React.SetStateAction<string | null>>;
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

const sampleRichMessages: UserRequestType[] = [
  {
    id: "4000",
    message: 'Show me user growth for the current year',
    agent_actions: [
      {
        id: "4001",
        final: true,
        recipe_idx: 0,
        result: {},
        action: {
          ability: 'message',
          text: "Here's a chart with user growth for the current year",
          graph: {
            graphType: 'line',
            data: [
              { label: 'Jan', value: 300 },
              { label: 'Feb', value: 500 },
              { label: 'Mar', value: 600 },
              { label: 'Apr', value: 900 },
            ]
          }
        },
      },
    ]
  },
  {
    id: '4002',
    message: 'Show me user growth for the current year in a bar chart',
    agent_actions: [
      {
        id: '4003',
        final: true,
        recipe_idx: 0,
        result: {},
        action: {
          ability: 'message',
          text: "Here's a chart with user growth for the current year",
          graph: {
            graphType: 'bar',
            data: [
              { label: 'Jan', value: 300 },
              { label: 'Feb', value: 500 },
              { label: 'Mar', value: 600 },
              { label: 'Apr', value: 900 },
            ]
          }
        },
      },
    ],
  },
  {
    id: '4004',
    message: 'Show me how many of my users are paid vs free',
    agent_actions: [
      {
        id: '4005',
        final: true,
        recipe_idx: 0,
        result: {},
        action: {
          ability: 'message',
          text: "Here's a chart comparing free vs paid users",
          graph: {
            graphType: 'pie',
            data: [
              { label: 'Free', value: 300 },
              { label: 'Paid', value: 500 },
            ]
          }
        },
      }
    ],
  },
];

declare const agentwp_settings: agentwpSettings;


export default function UserRequestsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteId = agentwp_settings.site_id;
  const token = agentwp_settings.access_token;

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
  }, [currentUserRequestId]);

  async function getConversation() {
    const awpClient = useAwpClient(token);
    const response = await awpClient.getConversation(siteId);
    setCurrentUserRequestId(response.data[response.data.length - 1]?.id);
    // setConversation([...conversation, ...response.data]);
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
