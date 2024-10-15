import { useEffect, useState } from 'react';
import type { AgentWpUser } from '@/Types/types';
import { User } from '@/Page/Admin/Settings/Partials/User';
import SearchUser from '@/Page/Admin/Settings/Partials/SearchUser';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import UserList from '../Partials/UserList';

export default function UsersManagement() {
  const { restReq, tryRequest } = useRestRequest();

  const [ users, setUsers ] = useState< AgentWpUser[] >( [] );
  const [ searching, setSearching ] = useState( false );

  async function getUsers() {
    const { data } = await tryRequest(
      'get',
      'agentwp_users',
      null,
      () => setSearching( true ),
      () => setSearching( false ),
    );

    setUsers( data );
    setSearching( false );
  }

  useEffect( () => {
    getUsers();
  }, [] );

  function searchUsers( value: string ) {
    setSearching( true );
    restReq
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
    <>
      <SearchUser searchUsers={ searchUsers } searching={ searching } />
      <UserList className="mt-5">
        { users.map( user => (
          <User user={ user } key={ user.id } />
        ) ) }
      </UserList>
    </>
  );
}
