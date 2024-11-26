import { Tag } from '@/Components/Tag';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import type { AgentWpUser } from '@/Types/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function User( { user }: { user: AgentWpUser } ) {
  const { t } = useTranslation();
  const { tryRequest } = useRestRequest();
  const [ checked, setChecked ] = useState( user.agentwp_access );

  async function setAgentwpAccess( value: boolean ) {
    if ( user.is_current_user ) return; // Prevent toggling for current user

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
    <div
      className={ `flex justify-between items-center p-2 ${
        checked ? 'bg-gray-100' : 'bg-white'
      } hover:bg-gray-100 transition rounded-lg cursor-pointer` }
      onClick={ () => setAgentwpAccess( ! checked ) }>
      <div className="flex items-center gap-4">
        <img src={ user.image } alt={ user.name } className={ 'w-8 h-8 rounded-full' } />
        <div>{ user.name }</div>
        { user.is_current_user && <Tag>{ t( 'YOU' ) }</Tag> }
        <Tag>{ user.role }</Tag>
      </div>
      <input
        type="checkbox"
        disabled={ user.is_current_user }
        checked={ checked }
        onChange={ e => e.stopPropagation() } // Prevent double-triggering
        className="mr-2 border border-grey-100 shadow-none focus:ring-2 focus:ring-brand-primary-muted/70 active:ring-2 active:ring-brand-primary-muted/70 pointer-events-none"
      />
    </div>
  );
}
