import { useEffect, useState } from 'react';
import type { AgentWpUser } from '@/Types/types';
import { User } from '@/Page/Admin/Settings/Partials/User';
import SearchUser from '@/Page/Admin/Settings/Partials/SearchUser';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import UserList from '../Partials/UserList';
import { Card } from '@/Components/Admin/Card';

export default function UsersManagement() {
  const { adminRequest, tryRequest } = useAdminRoute();

  const [ users, setUsers ] = useState< AgentWpUser[] >( [] );
  const [ searching, setSearching ] = useState( false );

  async function getUsers() {
    const response = await tryRequest(
      'get',
      'agentwp_users',
      null,
      () => setSearching( true ),
      () => setSearching( false ),
    );

    setUsers( response.data.data );
    setSearching( false );
  }

  useEffect( () => {
    getUsers();
  }, [] );

  function searchUsers( value: string ) {
    setSearching( true );
    adminRequest
      .get( 'agentwp_users', {
        params: {
          search: value,
        },
      } )
      .then( ( response: any ) => {
        setUsers( response.data.data );
        setSearching( false );
      } );
  }

  return (
    <Card className="max-w-[720px]">
      <SearchUser searchUsers={ searchUsers } searching={ searching } />
      <UserList className="mt-5">
        { users.map( user => (
          <User user={ user } key={ user.id } />
        ) ) }
      </UserList>
    </Card>
  );
}
