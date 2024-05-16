import type { AgentAction } from '@/Providers/UserRequestsProvider';
import ActionIncomplete from '../Actions/ActionIncomplete';
import ActionPending from '../Actions/ActionPending';
import { LoaderIcon } from 'lucide-react';
import MessageHeader from './MessageHeader';
import Avatar from '../../Avatar/Avatar';
import Feedback from '@/Components/Chat/Feedback';
import ActionComponent from '../Actions/ActionComponent';

export default function AgentResponse({
  agentActions,
  userRequestId,
  time,
  pending = false,
}: {
  agentActions?: AgentAction[];
  userRequestId: string;
  time: string;
  pending?: boolean;
}) {
  const messageAction = agentActions?.find(
    (aa) => aa.action?.ability === 'message',
  ) as AgentAction | undefined;

  const otherActions =
    agentActions?.filter((aa) => aa.action?.ability !== 'message') ?? [];

  return (
    <div className="text-black/60 py-4 border-t border-gray-25">
      {otherActions.length > 0 ? (
        <div className="flex-1">
          {otherActions.map((aa) => {
            if (!aa.action) {
              return (
                <ActionIncomplete
                  key={aa.id}
                  userRequestId={userRequestId}
                  {...aa}
                />
              );
            } else {
              return <ActionComponent key={aa.id} {...aa} />;
            }
          })}
        </div>
      ) : null}

      <MessageHeader>
        <Avatar name="AgentWP" time={time} />
        <Feedback />
      </MessageHeader>

      {pending && (
        <div className="p-4 rounded-lg border border-gray-25">
          <LoaderIcon className="animate-spin" /> Thinking...
        </div>
      )}
      {agentActions === undefined && <ActionPending />}
      {messageAction && <ActionComponent {...messageAction} />}
    </div>
  );
}
