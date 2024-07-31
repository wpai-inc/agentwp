import type { AgentAction } from '@/Providers/UserRequestsProvider';
import ActionIncomplete from '../Actions/ActionIncomplete';
import ActionPending from '../Actions/ActionPending';
import MessageHeader from './MessageHeader';
import Avatar from '../../Avatar/Avatar';
import Rate from '@/Components/Chat/Feedback/Rate';
import ActionComponent from '../Actions/ActionComponent';
import IconMore from '@material-design-icons/svg/outlined/more_vert.svg?react';
import { logoUrl } from '@/Components/Logo';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { useFeedback } from '@/Providers/FeedbackProvider';
import Reason from '@/Components/Chat/Feedback/Reason';
import ActionAborted from '../Actions/ActionAborted';

export default function AgentResponse({
  agentActions,
  userRequestId,
  time,
  pending = false,
  incomplete = false,
  aborted = false,
}: {
  agentActions?: AgentAction[];
  userRequestId: string;
  time: string;
  pending?: boolean;
  incomplete?: boolean;
  aborted?: boolean;
}) {
  const messageAction = agentActions?.find(aa => aa.action?.ability === 'message') as
    | AgentAction
    | undefined;

  const otherActions = agentActions?.filter(aa => aa.action?.ability !== 'message') ?? [];

  const { opened } = useFeedback();

  return (
    <div className="border-gray-25 border-t py-4 text-black/60">
      {otherActions.length > 0 ? (
        <div className="flex-1">
          {otherActions.map(aa => {
            if (aa.action) {
              return <ActionComponent key={aa.id} {...aa} />;
            }
          })}
        </div>
      ) : null}

      <MessageHeader>
        <Avatar name="AgentWP" time={time} image={logoUrl} />
        <div className="flex items-center gap-4">
          {!incomplete && <Rate />}
          <Popover>
            <PopoverTrigger>
              <IconMore className="text-brand-gray-15" />
            </PopoverTrigger>
            <PopoverContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <dt className="text-right font-bold">Responding Actions</dt>
                <dd>{agentActions?.length}</dd>
              </dl>
            </PopoverContent>
          </Popover>
        </div>
      </MessageHeader>

      {opened && <Reason />}

      {aborted && <ActionAborted />}

      {messageAction ? (
        <ActionComponent {...messageAction} />
      ) : (
        <>
          {pending && <ActionPending />}

          {incomplete && !pending && !aborted && <ActionIncomplete userRequestId={userRequestId} />}
        </>
      )}
    </div>
  );
}
