import AgentResponse from './AgentResponse';
import UserRequest from './UserRequest';
import type { UserRequestType } from '@/Providers/UserRequestsProvider';

export default function Message(userRequest: UserRequestType) {
  return (
    <div id={userRequest.id} className="space-y-6 divide-y-2">
      <UserRequest message={userRequest.message} />
      <AgentResponse
        userRequestId={userRequest.id}
        agentActions={userRequest.agent_actions}
      />
    </div>
  );
}
