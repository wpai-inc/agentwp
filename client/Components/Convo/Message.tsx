import { BaseAction, MessageAction, NavigateAction } from '@wpai/schemas';
import ActionNavigate from './Actions/ActionNavigate';
import ActionMessage from './Actions/ActionMessage';
import UserMessage from './UserMessage';
import { cn } from '@/lib/utils';

type Role = 'agent' | 'user';

export type MessageType = {
  id: string;
  role: Role;
  content: string | Action;
};

type Action = MessageAction | NavigateAction;

const isMessageAction = (action: BaseAction): action is MessageAction => {
  return action.ability === 'message';
};

const isNavigateAction = (action: BaseAction): action is NavigateAction => {
  return action.ability === 'navigate';
};

const AgentMessageComponent = ({ action }: { action: BaseAction }) => {
  if (isMessageAction(action)) {
    return <ActionMessage action={action} />;
  } else if (isNavigateAction(action)) {
    return <ActionNavigate action={action} />;
  }
  return null;
};

export default function Message({ id, role, content }: MessageType) {
  return (
    <div
      id={id}
      className={cn('text-white w-2/3 py-2 px-3 rounded-xl', {
        'ml-auto bg-blue-500': role === 'agent',
        'bg-green-500': role === 'user',
      })}
    >
      {role === 'agent' && typeof content !== 'string' && content.ability ? (
        <AgentMessageComponent action={content} />
      ) : (
        <UserMessage message={content} />
      )}
    </div>
  );
}
