import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { AgentAction, useUserRequests } from '@/Providers/UserRequestsProvider';
import { useError } from './ErrorProvider';
import { useRestRequest } from './RestRequestProvider';
import { StreamingStatusEnum } from '@/Types/enums';

export type StoreAgentResponse = {
  status: string;
  data: {
    results: any[];
  };
};

const ActionListenerProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { streamingStatus, startStream } = useStream();
  const { currentAction, currentUserRequestId } = useUserRequests();
  const { adminRequest } = useRestRequest();
  const { apiRequest } = useRestRequest();
  const { errors } = useError();

  useEffect( () => {
    if ( currentAction && streamingStatus === StreamingStatusEnum.OFF ) {
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
  }, [ currentAction, streamingStatus, currentUserRequestId ] );

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

  async function storeActionResult( aa: AgentAction, data: any ) {
    await apiRequest( 'siteRequestActionResult', {
      agentAction: aa.id,
      ...data,
    } );
  }

  async function executeAction( aa: AgentAction ) {
    switch ( aa.action.ability ) {
      case 'query':
        try {
          const response = await adminRequest.get( 'run_action_query', {
            params: {
              sql: aa.action.sql,
              args: aa.action.args,
            },
          } );
          await storeActionResult( aa, {
            status: 'success',
            data: response.data.data.results,
          } );
        } catch ( error ) {
          await storeActionResult( aa, {
            status: 'error',
            error: ( error as any ).response.data.data,
          } );
        }
        break;
      case 'navigate':
        await storeActionResult( aa, { status: 'success' } );
        window.location.href = aa.action.url as string;
        return new Promise( () => {
          /* never resolve to stop further execution */
        } );
        break;
      case 'message':
        await storeActionResult( aa, { status: 'success' } );
        break;
      case 'write_to_editor':
        await storeActionResult( aa, { status: 'success' } );
        break;
      case 'write_to_input':
        await storeActionResult( aa, { status: 'success' } );
        break;
      default:
        await storeActionResult( aa, { status: 'error', message: 'Invalid ability' } );
    }
  }

  return <>{ children }</>;
};

export default ActionListenerProvider;
