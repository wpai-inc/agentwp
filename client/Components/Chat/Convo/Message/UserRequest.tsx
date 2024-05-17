import MD from '@/Components/MD';
import Avatar from '../../Avatar/Avatar';
import MessageHeader from './MessageHeader';
import IconMore from '@material-design-icons/svg/outlined/more_vert.svg?react';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';

export default function UserRequest(userRequest: UserRequestType) {
  return (
    <div className="text-black/60">
      <MessageHeader>
        <Avatar
          name={userRequest.user.name}
          time={userRequest.human_created_at}
        />
        <Popover>
          <PopoverTrigger>
            <IconMore className="text-brand-gray-15" />
          </PopoverTrigger>
          <PopoverContent>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="text-right font-bold">Message ID</dt>
              <dd>{userRequest.id}</dd>
            </dl>
          </PopoverContent>
        </Popover>
      </MessageHeader>
      <div className="my-4 pr-4">
        <MD content={userRequest.message} />
      </div>
    </div>
  );
}
