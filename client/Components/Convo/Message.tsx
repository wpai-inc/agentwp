import AgentResponse from './AgentResponse';
import UserRequest from './UserRequest';
// import AgentMessage from './AgentMessage';
import type { UserRequestType } from '@/Providers/ChatProvider';

export default function Message(userRequest: UserRequestType) {
  return (
    <div id={userRequest.id} className="space-y-6 divide-y-2">
      <UserRequest message={userRequest.message} />

      <AgentResponse agentActions={userRequest.agent_actions} />
      {/* {role === 'agent' && typeof content !== 'string' && content.ability ? (
        <AgentMessage>
          <AgentMessageComponent action={content} />
        </AgentMessage>
      ) : (
        <UserMessage message={content} />
      )} */}
    </div>
  );
}
