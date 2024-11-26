import { useEffect, useState } from 'react';
import { Card } from '@/Components/Admin/Card';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import TaskCard from '../Partials/TaskCard';
import { CodeModel } from '@/Types/types';

export type TaskWithState = App.Data.CodePackageData & { state?: CodeModel };

export default function Tasks() {
  const { restReq } = useRestRequest();
  const [ tasks, setTasks ] = useState< TaskWithState[] >( [] );

  useEffect( () => {
    restReq< TaskWithState[] >( 'get_active_tasks' ).then( response => {
      setTasks( response.data.data );
    } );
  }, [] );

  return (
    <div className="grid grid-cols-2 gap-5">
      <Card title="Tasks" className="col-span-full md:col-span-1">
        { tasks.map( ( task, index ) => (
          <TaskCard key={ index } task={ task } />
        ) ) }
      </Card>
    </div>
  );
}
