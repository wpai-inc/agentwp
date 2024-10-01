import MD from '@/Components/MD';
import Avatar from '../../Avatar/Avatar';
import MessageHeader from './MessageHeader';
import IconMore from '@material-design-icons/svg/outlined/more_vert.svg?react';
import { UserRequestType } from '@/Providers/UserRequestsProvider';
import { WpUser } from '@/Types/types';
import DeleteRequest from '../Partials/DeleteRequest';
import useCopy from '@/Hooks/copy';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function UserRequest( {
  userRequest,
  user,
}: {
  userRequest: UserRequestType;
  user: WpUser;
} ) {
  const { copy, copied } = useCopy();

  return (
    <div className="text-black/60">
      <MessageHeader>
        <Avatar
          name={ user.display_name }
          image={ user.avatar_url }
          time={ userRequest.human_created_at }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <IconMore className="text-brand-gray-15" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <button onClick={ () => copy( userRequest.id ) }>
                { copied ? 'Copied' : 'Copy Request ID' }
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteRequest userRequest={ userRequest } />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </MessageHeader>
      <MD content={ userRequest.message } />
    </div>
  );
}
