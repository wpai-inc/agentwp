import { usePage } from '@/Providers/PageProvider';
import AgentResponse from './AgentResponse';
import UserRequest from './UserRequest';
import type { UserRequestType } from '@/Providers/UserRequestsProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { FeedbackProvider } from '@/Providers/FeedbackProvider';
import { useStream } from '@/Providers/StreamProvider';
import { StreamingStatusEnum } from '@/Types/enums';

export default function Message( {
  userRequest,
  submitted,
}: {
  userRequest: UserRequestType;
  submitted: boolean;
} ) {
  const { page } = usePage();
  const { currentUserRequestId } = useUserRequests();
  const sameUserRequest = userRequest.id === currentUserRequestId;
  const { streamingStatus } = useStream();
  const pending = ( sameUserRequest && streamingStatus > StreamingStatusEnum.OFF ) || submitted;
  const isIncomplete =
    userRequest.agent_actions?.length === 0 ||
    userRequest.agent_actions?.some( aa => ( ! aa.action && ! aa.result?.status ) || aa.hasError );
  const isAborted =
    streamingStatus === StreamingStatusEnum.SHOULD_ABORT ||
    userRequest.agent_actions?.some( aa => aa.result?.status === 'aborted' ) ||
    userRequest.status === 'aborted';

  return (
    <FeedbackProvider userRequestId={ userRequest.id } feedback={ userRequest.feedback }>
      <div id={ userRequest.id }>
        <div className="border-b border-brand-gray-25 p-4">
          <UserRequest userRequest={ userRequest } user={ page.user } />
        </div>
        <div className="border-b border-brand-gray-25 p-4">
          <AgentResponse
            userRequestId={ userRequest.id }
            time={ userRequest.human_created_at }
            agentActions={ userRequest.agent_actions }
            pending={ pending }
            incomplete={ isIncomplete }
            aborted={ isAborted }
          />
        </div>
      </div>
    </FeedbackProvider>
  );
}
