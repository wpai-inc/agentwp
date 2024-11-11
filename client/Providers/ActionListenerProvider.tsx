import { useEffect, createContext, useContext } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { ActionType, AgentAction, useUserRequests } from '@/Providers/UserRequestsProvider';
import { useRestRequest } from './RestRequestProvider';
import { StreamingStatusEnum } from '@/Types/enums';

type ActionListenerContextType = {
  actionNavigation: ( aa: AgentAction, confirm: boolean ) => Promise< void >;
};

const ActionListenerContext = createContext< ActionListenerContextType | undefined >( undefined );

export function useActionListener() {
  const actionListener = useContext( ActionListenerContext );
  if ( ! actionListener ) {
    throw new Error( 'useActionListener must be used within a ActionListenerProvider' );
  }
  return actionListener;
}

export default function ActionListenerProvider( { children }: { children: React.ReactNode } ) {
  const { streamingStatus, retryStream } = useStream();
  const { currentAction, updateCurrentAction, currentUserRequestId, addActionToCurrentRequest } =
    useUserRequests();
  const { proxyApiRequest, restReq } = useRestRequest();

  useEffect( () => {
    if ( currentUserRequestId && currentAction && streamingStatus === StreamingStatusEnum.OFF ) {
      if ( currentAction.action ) {
        console.log( 'current action', currentAction );
        executeAndContinueAction( currentAction, currentUserRequestId );
        return;
      }
      /**
       * Tries reconnecting stream.
       * Allows for two errors before stopping the stream.
       */
      if ( currentAction.final && ! currentAction.hasExecuted && currentAction.action ) {
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
    if ( reqId && aa.hasExecuted && ( ! aa.final || aa.hasError ) ) {
      await retryStream( reqId );
    }
  }

  async function storeActionResult( aa: AgentAction, data: App.Data.AgentActionResultData ) {
    if ( ! aa.id ) {
      throw new Error( 'Agent action ID is not set' );
    }

    return await proxyApiRequest< App.Data.AgentActionData >( 'actionResult', {
      agentAction: aa.id,
      ...data,
    } );
  }

  async function storeSuccessfulActionResult( aa: AgentAction, data: any = null ) {
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

  async function actionNavigation( aa: AgentAction, confirm: boolean ) {
    if ( confirm ) {
      await storeSuccessfulActionResult( aa, { confirmed: true } );
      window.location.href = aa.action.url as string;
    } else {
      const updatedAction = await storeSuccessfulActionResult( aa, { confirmed: false } );
      updateCurrentAction( updatedAction );
    }
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
          const err = ( error as any )?.response?.data?.data ?? 'Unknown error';
          const result = await storeUnsuccessfulActionResult( aa, err );
          updateCurrentAction( result );
        }
        break;
      case 'navigate':
        if ( currentUserRequestId && currentAction ) {
          const agentResponseAction: AgentAction = {
            ...currentAction,
            action: {
              ...currentAction.action,
              ability: 'navigation_confirmation',
            } as ActionType,
            hasExecuted: true,
            final: true,
          };

          addActionToCurrentRequest( currentUserRequestId, agentResponseAction );
        }
        await new Promise( () => {} );
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

  return (
    <ActionListenerContext.Provider
      value={ {
        actionNavigation: actionNavigation,
      } }>
      { children }
    </ActionListenerContext.Provider>
  );
}
