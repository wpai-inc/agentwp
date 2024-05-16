import MD from '@/Components/MD';
import Avatar from '../../Avatar/Avatar';
import MessageHeader from './MessageHeader';
import IconMore from '@material-design-icons/svg/outlined/more_vert.svg?react';

export default function UserRequest({
  message,
  time,
}: {
  message: string;
  time: string;
}) {
  return (
    <div className="text-black/60">
      <MessageHeader>
        <Avatar name="James Lepage" time={time} />
        <button>
          <IconMore />
        </button>
      </MessageHeader>
      <div className="my-4 pr-4 text-md">
        <MD content={message} />
      </div>
    </div>
  );
}
