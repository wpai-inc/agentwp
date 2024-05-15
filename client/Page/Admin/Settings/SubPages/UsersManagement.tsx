import { useEffect, useState } from 'react';
import type { agentwpUser } from '@/Types/types';
import { User } from '@/Page/Admin/Settings/Partials/User';
import SearchUser from '@/Page/Admin/Settings/Partials/SearchUser';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';

export default function UsersManagement() {
  const adminRequest = useAdminRoute();

  const [users, setUsers] = useState<agentwpUser[]>([]);
  const [searching, setSearching] = useState(false);

  function getUsers() {
    setSearching(true);
    adminRequest.get('/agentwp/v1/agentwp_users').then((response: any) => {
      setUsers(response.data);
      setSearching(false);
    });
  }

  useEffect(() => {
    getUsers();
  }, []);

  function searchUsers(value: string) {
    setSearching(true);
    adminRequest
      .get('/agentwp/v1/agentwp_users', {
        params: {
          search: value,
        },
      })
      .then((response: any) => {
        setUsers(response.data);
        setSearching(false);
      });
  }

  return (
    <div className="max-w-[720px] text-base mt-12">
      <SearchUser searchUsers={searchUsers} searching={searching} />
      <div>
        {users.map((user) => (
          <User user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
