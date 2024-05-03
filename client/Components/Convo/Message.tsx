import React from 'react';
import { BaseAction } from '@wpai/schemas';
import UserMessage from './UserMessage';
import AgentMessage from './AgentMessage';
import RichMessage from "@/Components/RichMessage";

type Role = 'agent' | 'user';

/**
 * TODO there is a mismatch in BaseAction, MessageAction, NavigateAcion, etc...
 * In this code we are looking for `ability` which is correct according to the
 * JSON schema https://github.com/wpai-inc/schemas/blob/main/src/schemas/action.schema.json
 * But the imported library has `capability` property.
 * We must update the @wpai/schemas repo
 */

export type MessageType = {
  id: string;
  role: Role;
  content: string | BaseAction;
};

const isAgentMessage = (role, content) => {
  return role === 'agent' && typeof content !== 'string' && content?.ability;
}

const isUserMessage = (role) => {
  return role === 'user';
}

export default function Message({ id, role, content }: MessageType) {
  return (
    <div id={id} className="py-2 px-3">
      {isAgentMessage(role, content) ? (
        <AgentMessage>
          <RichMessage action={content as BaseAction} />
        </AgentMessage>
      ) : null}
      {isUserMessage(role) ? <UserMessage message={content as string} /> : null}
    </div>
  );
}
