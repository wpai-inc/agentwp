import { usePage } from '@/Providers/PageProvider';
import AgentResponse from './AgentResponse';
import UserRequest from './UserRequest';
import type { UserRequestType } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { FeedbackProvider } from '@/Providers/FeedbackProvider';

export default function Message( userRequest: UserRequestType ) {
  const { page } = usePage();
  const { currentAction, currentUserRequestId } = useUserRequests();
  const pending = ! currentAction?.final && userRequest.id === currentUserRequestId;

  return (
    <FeedbackProvider userRequestId={ userRequest.id } feedback={ userRequest.feedback }>
      <div id={ userRequest.id } className="border-b border-brand-gray-25 mb-4">
        <UserRequest userRequest={ userRequest } user={ page.user } />
        <AgentResponse
          userRequestId={ userRequest.id }
          time={ userRequest.human_created_at }
          agentActions={ userRequest.agent_actions }
          pending={ pending }
        />
      </div>
    </FeedbackProvider>
  );
}
