import { useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { TaskWithState } from '../SubPages/Tasks';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function TaskCard( { task }: { task: TaskWithState } ) {
  const { tryRequest } = useRestRequest();
  const [ state, setState ] = useState( task.state );

  async function activate( active: boolean ) {
    const res = await tryRequest< TaskWithState >( 'post', 'activate_code', {
      id: task.state?.id,
      code_id: task.id,
      active,
    } );

    setState( res.data.state );
  }

  return (
    <div>
      <h2 className="font-bold">{ task.name }</h2>
      <p>{ task.description }</p>
      <Label>
        Active
        <Switch
          onCheckedChange={ ( checked: boolean ) => activate( checked ) }
          checked={ state?.active }
        />
      </Label>
    </div>
  );
}
