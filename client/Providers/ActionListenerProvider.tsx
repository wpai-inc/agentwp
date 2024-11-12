import { useState, useEffect, createContext, useContext } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { ActionType, AgentAction, useUserRequests } from '@/Providers/UserRequestsProvider';
import { useRestRequest } from './RestRequestProvider';

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
  const { retryStream } = useStream();
  const { currentAction, updateCurrentAction, currentUserRequestId, addActionToCurrentRequest } =
    useUserRequests();
  const { proxyApiRequest, restReq } = useRestRequest();
  const [ executing, setExecuting ] = useState< boolean >( false );

  useEffect( () => {
    if ( currentUserRequestId && currentAction?.action && ! executing ) {
      async function continueActions( aa: AgentAction, reqId: string ) {
        setExecuting( true );

        if ( ! aa.hasExecuted ) {
          await executeAction( aa );
          aa.hasExecuted = true;
        }

        if ( ! aa.final ) {
          console.log( 'Not Final', aa );
          await retryStream( reqId );
        }

        setExecuting( false );
      }

      continueActions( currentAction, currentUserRequestId );
    }
  }, [ currentAction, currentUserRequestId, executing ] );

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
      setExecuting( false );
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
