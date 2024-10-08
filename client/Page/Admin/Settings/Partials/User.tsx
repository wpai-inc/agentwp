import { Tag } from '@/Components/Tag';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import type { AgentWpUser } from '@/Types/types';
import { useState } from 'react';

export function User( { user }: { user: AgentWpUser } ) {
  const { tryRequest } = useRestRequest();
  const [ checked, setChecked ] = useState( user.agentwp_access );

  async function setAgentwpAccess( value: boolean ) {
    await tryRequest(
      'post',
      'update_user',
      {
        user: user.id,
        agentwp_access: value,
      },
      () => setChecked( value ),
      () => setChecked( ! value ),
    );
  }

  return (
    <div className="flex justify-between items-center p-2 odd:bg-brand-gray-20">
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
