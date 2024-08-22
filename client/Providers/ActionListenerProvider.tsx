import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { AgentAction, useUserRequests } from '@/Providers/UserRequestsProvider';
import { useError } from './ErrorProvider';
import { useAdminRoute } from './AdminRouteProvider';
import { useClient } from './ClientProvider';

export type StoreAgentResponse = {
  status: string;
  data: {
    results: any[];
  };
};

const ActionListenerProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { streamClosed, startStream } = useStream();
  const { currentAction, currentUserRequestId } = useUserRequests();
  const { adminRequest } = useAdminRoute();
  const { client } = useClient();
  const { errors } = useError();

  useEffect( () => {
    if ( currentAction && streamClosed ) {
      if ( currentAction.action ) {
        executeAndContinueAction( currentAction, currentUserRequestId );
        return;
      }
      /**
       * Tries reconnecting stream.
       * Allows for two errors before stopping the stream.
       */
      if (
        currentAction.final &&
        ! currentAction.hasExecuted &&
        currentAction.action &&
        errors.length < 2
      ) {
        startStream( currentUserRequestId );
      }
    }
  }, [ currentAction, streamClosed, currentUserRequestId ] );

  async function executeAndContinueAction( aa: AgentAction, reqId: string | null ) {
    if ( ! aa.hasExecuted ) {
      await executeAction( aa );
      aa.hasExecuted = true;
    }

    await continueActionStream( reqId, aa );
  }

  async function continueActionStream( reqId: string | null, aa: AgentAction ) {
    if ( reqId && ! aa.final && aa.hasExecuted ) {
      await startStream( reqId );
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
        window.location.href = aa.action.url as string;
        return new Promise( () => {
          /* never resolve to stop further execution */
        } );
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
      case 'write_to_input':
        await client.storeAgentResult( aa.id, {
          status: 'success',
        } );
        break;
    }
    //@ovi Prevent multiple executions of the same action
    // aa.hasExecuted = true;
  }

  return <>{ children }</>;
};

export default ActionListenerProvider;
