import { MessageAction } from '@wpai/schemas';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';
import { cn } from '@/lib/utils';

type Role = 'agent' | 'user';

export type MessageType = {
  id: string;
  role: Role;
  content: string | MessageAction;
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
      {role === 'agent' ? (
        <AgentMessage action={content} />
      ) : (
        <UserMessage message={content} />
      )}
    </div>
  );
}
