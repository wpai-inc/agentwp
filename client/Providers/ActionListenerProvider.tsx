import { useEffect } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { AgentAction, useUserRequests } from '@/Providers/UserRequestsProvider';
import { useError } from './ErrorProvider';
import { useRestRequest } from './RestRequestProvider';
import { StreamingStatusEnum } from '@/Types/enums';

const ActionListenerProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { streamingStatus, retryStream } = useStream();
  const { currentAction, currentUserRequestId } = useUserRequests();
  const { proxyApiRequest, restReq } = useRestRequest();
  const { errors } = useError();

  useEffect( () => {
    if ( currentUserRequestId && currentAction && streamingStatus === StreamingStatusEnum.OFF ) {
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
        retryStream( currentUserRequestId );
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
      await retryStream( reqId );
    }
  }

  async function storeActionResult( aa: AgentAction, data: App.Data.AgentActionResultData ) {
    if ( ! aa.id ) {
      throw new Error( 'Agent action ID is not set' );
    }

    await proxyApiRequest< App.Data.AgentActionData >( 'actionResult', {
      agentAction: aa.id,
      ...data,
    } );
  }

  async function storeSuccessfulActionResult( aa: AgentAction, data: any[] | null = null ) {
    const result: App.Data.AgentActionResultData = {
      status: 'success',
      error: null,
      data,
    };
    return storeActionResult( aa, result );
  }

  async function storeUnsuccessfulActionResult( aa: AgentAction, error: string ) {
    const result: App.Data.AgentActionResultData = {
      status: 'error',
      error,
      data: null,
    };
    return storeActionResult( aa, result );
  }

  async function executeAction( aa: AgentAction ) {
    switch ( aa.action.ability ) {
      case 'query':
        try {
          const response = await restReq.post( 'run_action_query', {
            sql: aa.action.sql,
            args: aa.action.args,
          } );

          await storeSuccessfulActionResult( aa, response.data.data.results );
        } catch ( error ) {
          await storeUnsuccessfulActionResult( aa, ( error as any )?.response?.data?.data );
        }
        break;
      case 'navigate':
        await storeSuccessfulActionResult( aa );
        window.location.href = aa.action.url as string;
        return new Promise( () => {
          /* never resolve to stop further execution */
        } );
        break;
      case 'message':
        await storeSuccessfulActionResult( aa );
        break;
      case 'write_to_editor':
        await storeSuccessfulActionResult( aa );
        break;
      case 'write_to_input':
        await storeSuccessfulActionResult( aa );
        break;
      default:
        await storeUnsuccessfulActionResult( aa, 'Invalid ability' );
    }
  }

  return <>{ children }</>;
};

export default ActionListenerProvider;
