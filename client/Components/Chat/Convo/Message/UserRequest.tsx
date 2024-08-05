import MD from '@/Components/MD';
import Avatar from '../../Avatar/Avatar';
import MessageHeader from './MessageHeader';
import IconMore from '@material-design-icons/svg/outlined/more_vert.svg?react';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { WpUser } from '@/Types/types';
import MessageMeta from './MessageMeta';

export default function UserRequest( {
  userRequest,
  user,
}: {
  userRequest: UserRequestType;
  user: WpUser;
} ) {
  return (
    <div className="text-black/60">
      <MessageHeader>
        <Avatar
          name={ user.display_name }
          image={ user.avatar_url }
          time={ userRequest.human_created_at }
        />
        <Popover>
          <PopoverTrigger>
            <IconMore className="text-brand-gray-15" />
          </PopoverTrigger>
          <PopoverContent>
            <MessageMeta meta={[
              {
                label: 'Message ID',
                value: userRequest.id,
              },
              {
                label: 'User',
                value: user.display_name,
              },
            ]}/>
          </PopoverContent>
        </Popover>
      </MessageHeader>
      <div className="my-4 pr-4">
        <MD content={ userRequest.message } />
      </div>
    </div>
  );
}
