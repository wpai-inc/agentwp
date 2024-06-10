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
import { FeedbackType } from '@/Types/types';
import { useStream } from '@/Providers/StreamProvider';
import { useFeedback } from '@/Providers/FeedbackProvider';
import Reason from '@/Components/Chat/Feedback/Reason';

export default function AgentResponse( {
  agentActions,
  userRequestId,
  time,
  pending = false,
}: {
  agentActions?: AgentAction[];
  userRequestId: string;
  time: string;
  pending?: boolean;
} ) {
  const { streamClosed } = useStream();

  const messageAction = agentActions?.find( aa => aa.action?.ability === 'message' ) as
    | AgentAction
    | undefined;

  const otherActions = agentActions?.filter( aa => aa.action?.ability !== 'message' ) ?? [];

  const isPending = ! streamClosed || pending;

  const isIncomplete =
    ( streamClosed && ! pending ) || ( streamClosed && agentActions?.some( aa => ! aa.action ) );

  const { opened } = useFeedback();

  return (
    <div className="text-black/60 py-4 border-t border-gray-25">
      { otherActions.length > 0 ? (
        <div className="flex-1">
          { otherActions.map( aa => {
            if ( aa.action ) {
              return <ActionComponent key={ aa.id } { ...aa } />;
            }
          } ) }
        </div>
      ) : null }

      <MessageHeader>
        <Avatar name="AgentWP" time={ time } image={ logoUrl } />
        <div className="flex items-center gap-4">
          { ! isIncomplete && <Rate /> }
          <Popover>
            <PopoverTrigger>
              <IconMore className="text-brand-gray-15" />
            </PopoverTrigger>
            <PopoverContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <dt className="text-right font-bold">Responding Actions</dt>
                <dd>{ agentActions?.length }</dd>
              </dl>
            </PopoverContent>
          </Popover>
        </div>
      </MessageHeader>

      { opened && <Reason /> }

      { ( pending || agentActions === undefined ) && <ActionPending /> }

      { isIncomplete && <p>Something went wrong attending to your request.</p> }

      { messageAction && <ActionComponent { ...messageAction } /> }

      { ! messageAction && (
        <>
          { isPending && <ActionPending /> }

          { isIncomplete && <ActionIncomplete userRequestId={ userRequestId } /> }
        </>
      ) }
    </div>
  );
}
