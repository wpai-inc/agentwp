import { Tag } from '@/Components/Tag';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import { useNotifications } from '@/Providers/NotificationProvider';
import type { AgentWpUser } from '@/Types/types';
import { useState } from 'react';

export function User( { user }: { user: AgentWpUser } ) {
  const adminRequest = useAdminRoute();
  const { notify } = useNotifications();
  const [ checked, setChecked ] = useState( user.agentwp_access );

  async function setAgentwpAccess( value: boolean ) {
    setChecked( value );
    try {
      await adminRequest.post( 'update_user', {
        user: user.id,
        agentwp_access: value,
      } );
    } catch ( error ) {
      const msg = error.response.data.data;
      console.error( 'caught error: ', msg );
      notify.error( msg );
      setChecked( ! value );
    }
  }

  return (
    <div className="flex justify-between items-center p-2 odd:bg-gray-100">
      <div className="flex items-center gap-4">
        <img src={ user.image } alt={ user.name } className={ 'w-8 h-8 rounded-full' } />
        <div>{ user.name }</div>
        { user.is_current_user && <Tag>YOU</Tag> }
        <Tag>{ user.role }</Tag>
      </div>
      <input
        type="checkbox"
        disabled={ user.is_current_user }
        checked={ checked }
        onChange={ e => setAgentwpAccess( e.target.checked ) }
      />
    </div>
  );
}
