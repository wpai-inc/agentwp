import MD from '@/Components/MD';
import Avatar from '../../Avatar/Avatar';

export default function UserRequest({
  message,
  time,
}: {
  message: string;
  time: string;
}) {
  return (
    <div className="flex gap-4">
      <Avatar name="James Lepage" time={time} />
      <div className="flex-1">
        <MD content={message} />
      </div>
    </div>
  );
}
