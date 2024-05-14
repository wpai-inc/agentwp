import { useState } from 'react';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';

declare const agent_wp_admin_settings: any;
export default function UsersManagement() {
  const [users, setUsers] = useState(agent_wp_admin_settings.users);
  const adminRequest = useAdminRoute();

  function setManageAgentwpUsers(user: any) {
    const newUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          manage_agentwp_users: !u.manage_agentwp_users,
        };
      }
      return u;
    });

    adminRequest.post('?action=agentwp_update_user', {
      user: user.id,
      manage_agentwp_users: !user.manage_agentwp_users,
    });

    setUsers(newUsers);
  }

  function setAgentwpAccess(user: any) {
    const newUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          agentwp_access: !u.agentwp_access,
        };
      }
      return u;
    });

    adminRequest.post('?action=agentwp_update_user', {
      user: user.id,
      agentwp_access: !user.agentwp_access,
    });

    setUsers(newUsers);
  }

  return (
    <div>
      Users Management
      <table className="wp-list-table widefat striped table-view-list">
        <thead>
          <tr>
            <th>User</th>
            <th>Can access the agent</th>
            <th>Can manage users</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => {
            return (
              <tr key={user.id}>
                <td>
                  {user.display_name} ({user.user_email})
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.agentwp_access}
                    onChange={() => setAgentwpAccess(user)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.manage_agentwp_users}
                    onChange={() => setManageAgentwpUsers(user)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
