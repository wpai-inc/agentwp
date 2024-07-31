import React, { useState, createContext, useContext, useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import type { UserRequestType, AgentAction } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';
import { CleanGutenbergContent, WriteToEditor } from '@/Services/WriteToEditor';
import { type BlockType } from '@/Types/types';
import { useInputSelect } from './InputSelectProvider';
import { CleanInputFieldContent, WriteToInputField } from '@/Services/WriteToInputField';

type CreateUserRequestResponse = {
  stream_url: string;
  user_request: UserRequestType;
};

type ChatSettingProps = { component: React.ReactNode; header: string } | null;

const ChatContext = createContext({
  conversation: [] as UserRequestType[],
  sendMessage: (_message: string) => {},
  cancelStreaming: () => {},
  setChatSetting: (_setting: ChatSettingProps) => {},
  chatSetting: null as ChatSettingProps,
});

export function useChat() {
  const chat = useContext(ChatContext);
  if (!chat) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return chat;
}

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const { client } = useClient();
  const [chatSetting, setChatSetting] = useState<ChatSettingProps>(null);
  const { conversation, setConversation, currentUserRequestId } = useUserRequests();
  const { startStream, liveAction, error, streamsAbborted } = useStream();
  const { addErrors } = useError();
  const [editorContent, setEditorContent] = useState<BlockType[]>([]);
  const [startingStreaming, setStartingStreaming] = useState({
    userRequestId: '',
    liveAction: null as AgentAction | null,
  });

  const { selectedInput } = useInputSelect();

  useEffect(() => {
    if (liveAction && currentUserRequestId) {
      if (startingStreaming.userRequestId !== currentUserRequestId) {
        setStartingStreaming({
          userRequestId: currentUserRequestId,
          liveAction,
        });
      }
      if (liveAction.action.ability === 'write_to_editor' && liveAction.action.text) {
        const text = liveAction.action.text.replace(/```json/g, '').replace(/```/g, '');
        const newEditorContent = WriteToEditor(text, editorContent);
        if (newEditorContent?.content) {
          console.log('newEditorContent', newEditorContent);
          setEditorContent(newEditorContent.content);
        }

        if (newEditorContent?.summary) {
          liveAction.action.ability = 'message';
          liveAction.action.text = newEditorContent.summary;
          updateAgentMessage(currentUserRequestId, liveAction);
        }
      } else if (liveAction.action.ability === 'write_to_input' && liveAction.action.text) {
        const text = liveAction.action.text.replace(/```json/g, '').replace(/```/g, '');
        const newInputFieldContent = WriteToInputField(text, selectedInput);
        if (newInputFieldContent?.content) {
          console.log('newInputFieldContent', newInputFieldContent);
          // setInputFieldContent(newInputFieldContent.content);
        }

        if (newInputFieldContent?.summary) {
          liveAction.action.ability = 'message';
          liveAction.action.text = newInputFieldContent.summary;
          updateAgentMessage(currentUserRequestId, liveAction);
        }
      } else if (liveAction.action.ability === 'message') {
        updateAgentMessage(currentUserRequestId, liveAction);
      }
    }
  }, [liveAction, currentUserRequestId]);

  useEffect(() => {
    if (startingStreaming.liveAction?.action.ability === 'write_to_editor') {
      // clear the editor content
      CleanGutenbergContent();
    } else if (startingStreaming.liveAction?.action.ability === 'write_to_input') {
      // clear the editor content
      CleanInputFieldContent(selectedInput);
    }
  }, [startingStreaming]);

  useEffect(() => {
    if (error) {
      console.error('Stream error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (streamsAbborted.length > 0) {
      // update conversations
      setConversation(prev =>
        prev.map(msg => {
          if (streamsAbborted.includes(msg.id)) {
            if (msg.agent_actions.length > 0) {
              return {
                ...msg,
                agent_actions: msg.agent_actions.map(aa => {
                  return {
                    ...aa,
                    result: {
                      status: 'aborted',
                    },
                  };
                }),
              };
            }

            msg.agent_actions.push({
              id: '',
              created_at: new Date().toISOString(),
              human_created_at: new Date().toISOString(),
              action: {
                ability: 'message',
                text: '',
              },
              final: true,
              recipe_idx: 0,
              result: {
                status: 'aborted',
              },
              hasExecuted: true,
            });
          }
          return msg;
        }),
      );
    }
  }, [streamsAbborted]);

  async function userRequest(message: string): Promise<CreateUserRequestResponse> {
    const response = await client.storeConversation({ message, selected_input: selectedInput });
    return response.data;
  }

  /**
   * Adds or updates a msg in the conversation
   * @returns void
   * @param urId
   * @param updatedAa
   */
  function updateAgentMessage(urId: string, updatedAa: AgentAction) {
    setConversation((prev: UserRequestType[]) => {
      return prev.map(function (msg) {
        if (msg.id === urId) {
          return {
            ...msg,
            agent_actions: msg.agent_actions
              ? msg.agent_actions.some(aa => aa.id === updatedAa.id)
                ? msg.agent_actions.map(aa => (aa.id === updatedAa.id ? updatedAa : aa))
                : [...msg.agent_actions, updatedAa]
              : [updatedAa],
          };
        }
        return msg;
      });
    });
  }

  function addUserRequest(msg: UserRequestType) {
    setConversation([msg, ...conversation]);
  }

  async function sendMessage(message: string) {
    try {
      const { stream_url, user_request } = await userRequest(message);
      addUserRequest(user_request);
      startStream(stream_url, user_request.id);
    } catch (e: any) {
      addErrors([e.message]);
      console.error(e);
    }
  }

  async function cancelStreaming() {
    try {
      const { stream_url, user_request } = await userRequest( message );
      addUserRequest( user_request );
      startStream( stream_url, user_request.id );
    } catch ( e: any ) {
      addErrors( [ e.message ] );
      console.error( e );
    }
  }

  return (
    <ChatContext.Provider
      value={{
        conversation,
        sendMessage,
        cancelStreaming,
        setChatSetting,
        chatSetting,
      }}>
      {children}
    </ChatContext.Provider>
  );
}
