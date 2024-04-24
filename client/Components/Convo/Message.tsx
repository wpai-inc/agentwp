import { MessageAction } from '@wpai/schemas';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';

type Role = 'agent' | 'user';

export type MessageType = {
  id: string;
  role: Role;
  content: string | MessageAction;
};

export default function Message({ id, role, content }: MessageType) {
  return (
    <div id={id}>
      {role === 'agent' ? (
        <AgentMessage action={content} />
      ) : (
        <UserMessage message={content} />
      )}
    </div>
  );
}
