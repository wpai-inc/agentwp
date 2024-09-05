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
import MessageMeta from '@/Components/Chat/Convo/Message/MessageMeta';
import { AnimatePresence, motion } from 'framer-motion';
import ActionAborted from '@/Components/Chat/Convo/Actions/ActionAborted';

export default function AgentResponse( {
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
} ) {
  const messageAction = agentActions?.find( aa => aa.action?.ability === 'message' ) as
    | AgentAction
    | undefined;

  const otherActions = agentActions?.filter( aa => aa.action?.ability !== 'message' ) ?? [];

  const { opened } = useFeedback();

  return (
    <div className="text-black/60">
      { otherActions.length > 0 ? (
        <div className="mb-4 flex-1 space-y-2">
          { otherActions.map( aa => {
            if ( aa.action ) {
              return <ActionComponent key={ aa.id } { ...aa } />;
            }
          } ) }
        </div>
      ) : null }

      <MessageHeader>
        <Avatar
          name="AgentWP"
          time={ time }
          image={ logoUrl }
          className="border-brand border p-1"
        />
        <div className="flex items-center gap-4">
          { ! incomplete && <Rate /> }
          <Popover>
            <PopoverTrigger>
              <IconMore className="text-brand-gray-15" />
            </PopoverTrigger>
            <PopoverContent>
              <MessageMeta
                meta={ [
                  {
                    label: 'Responding Actions',
                    value: agentActions?.length ?? 0,
                  },
                  {
                    label: 'Message ID',
                    value: userRequestId,
                  },
                ] }
              />
            </PopoverContent>
          </Popover>
        </div>
      </MessageHeader>

      <AnimatePresence>
        { opened && (
          <motion.div
            initial={ { opacity: 0, y: '100%', scaleY: 0 } }
            animate={ { opacity: 1, y: 0, scaleY: 1 } }
            exit={ { opacity: 0, y: '100%', scaleY: 0 } }>
            <Reason />
          </motion.div>
        ) }
      </AnimatePresence>

      { messageAction ? (
        <ActionComponent { ...messageAction } />
      ) : (
        <>
          { aborted && <ActionAborted /> }
          { ! aborted && pending && <ActionPending /> }
          { ! aborted && incomplete && ! pending && (
            <ActionIncomplete userRequestId={ userRequestId } />
          ) }
        </>
      ) }
    </div>
  );
}
