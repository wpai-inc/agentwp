import AgentResponse from './AgentResponse';
import UserRequest from './UserRequest';
import type { UserRequestType } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';

export default function Message(userRequest: UserRequestType) {
  const { currentAction, currentUserRequestId } = useUserRequests();
  const pending =
    !currentAction?.final && userRequest.id === currentUserRequestId;

  return (
    <div id={userRequest.id} className="space-y-6 divide-y-2">
      <UserRequest message={userRequest.message} />
      <AgentResponse
        userRequestId={userRequest.id}
        agentActions={userRequest.agent_actions}
        pending={pending}
      />
    </div>
  );
}
