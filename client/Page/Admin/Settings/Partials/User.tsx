import { Tag } from '@/Components/Tag';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import type { agentwpUser } from '@/Types/types';
import { useState } from 'react';

export function User({ user }: { user: agentwpUser }) {
  const adminRequest = useAdminRoute();

  const [theUser, setTheUser] = useState<agentwpUser>(user);
  // function setManageAgentwpUsers() {
  //     setTheUser({ ...theUser, manage_agentwp_users: !theUser.manage_agentwp_users });
  //     adminRequest.post("/agentwp/v1/update_user", { user: theUser.id, manage_agentwp_users: !theUser.manage_agentwp_users });
  // }

  function setAgentwpAccess() {
    setTheUser({ ...theUser, agentwp_access: !theUser.agentwp_access });
    adminRequest.post('/agentwp/v1/update_user', {
      user: theUser.id,
      agentwp_access: !theUser.agentwp_access,
    });
  }

  return (
    <div
      key={theUser.id}
      className="flex justify-start gap-4 items-center p-2 bg-gray-100 rounded-xl mt-4"
    >
      <img
        src={theUser.image}
        alt={theUser.name}
        className={'w-8 h-8 rounded-full'}
      />
      <div>{theUser.name}</div>
      {theUser.is_current_user && <Tag>YOU</Tag>}
      <Tag>{theUser.role}</Tag>
      <div className={'flex-grow flex justify-end'}>
        <input
          disabled={theUser.is_current_user}
          type="checkbox"
          checked={theUser.agentwp_access}
          onChange={() => setAgentwpAccess()}
        />
      </div>
    </div>
  );
}
