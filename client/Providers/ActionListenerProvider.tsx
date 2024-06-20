import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { AgentAction, useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useAdminRoute } from './AdminRouteProvider';
import { WriteToEditor } from '@/Services/WriteToEditor';

const ActionListenerProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { streamClosed, startStreamFromRequest } = useStream();
  const { currentAction, currentUserRequestId } = useUserRequests();
  const adminRequest = useAdminRoute();
  const { client } = useClient();

  useEffect( () => {
    if ( currentAction && streamClosed && currentAction.action ) {
      executeAndContinueAction( currentAction, currentUserRequestId ).then( r =>
        console.log( 'executeAndContinueAction', currentAction.action.ability ),
      );
    }
  }, [ currentAction, streamClosed, currentUserRequestId ] );

  async function executeAndContinueAction( aa: AgentAction, reqId: string | null ) {
    if ( ! aa.hasExecuted ) {
      await executeAction( aa );
      aa.hasExecuted = true;
    }

    continueActionStream( reqId, aa );
  }

  function continueActionStream( reqId: string | null, aa: AgentAction ) {
    if ( reqId && ! aa.final && aa.hasExecuted ) {
      startStreamFromRequest( reqId );
    }
  }

  async function executeAction( aa: AgentAction ) {
    switch ( aa.action.ability ) {
      case 'query':
        // TODO: BUG the stream is not waiting for this to finish
        // Probably because this component is rerendered from outside
        try {
          const response = await adminRequest.get( 'run_action_query', {
            params: {
              sql: aa.action.sql,
              args: aa.action.args,
            },
          } );
          await client.storeAgentResult( aa.id, {
            status: 'success',
            data: response.data.data.results,
          } );
        } catch ( error ) {
          console.error( 'Query execution error', ( error as any ).response.data.data );
          // Handle error if needed
          await client.storeAgentResult( aa.id, {
            status: 'error',
            error: ( error as any ).response.data.data,
          } );
        }
        break;
      case 'navigate':
        await client.storeAgentResult( aa.id, {
          status: 'success',
        } );
        window.location.href = aa.action.url;
        break;
      case 'message':
        await client.storeAgentResult( aa.id, {
          status: 'success',
        } );
        break;
      case 'write_to_editor':
        await client.storeAgentResult( aa.id, {
          status: 'success',
        } );
        break;
    }
  }

  return <>{ children }</>;
};

export default ActionListenerProvider;
