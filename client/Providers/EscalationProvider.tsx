import React, { createContext, FC, useContext, useState } from 'react';
import { MessageActionEscalation } from '@wpai/schemas';
import { useClient } from '@/Providers/ClientProvider';
import { useError } from '@/Providers/ErrorProvider';

interface ContextProps {
  createEscalation: () => Promise< void >;
  created: boolean;
  loading: boolean;
}

export const EscalationContext = createContext< ContextProps | undefined >( undefined );

export function useEscalation() {
  const ctx = useContext( EscalationContext );
  if ( ! ctx ) {
    throw new Error( 'useEscalation must be used within EscalationProvider' );
  }
  return ctx;
}

export const EscalationProvider: FC< {
  children: React.ReactNode;
  escalation: MessageActionEscalation;
} > = ( { children, escalation } ) => {
  const [ created, setCreated ] = useState< boolean >( false );
  const [ loading, setLoading ] = useState< boolean >( false );

  const { client } = useClient();
  const { addErrors } = useError();

  async function escalationRequest( data: MessageActionEscalation ): Promise< void > {
    const response = await client.isAuthorized()?.postEscalation( data.id );

    return response.data;
  }

  async function createEscalation() {
    setLoading( true );

    try {
      await escalationRequest( escalation );
      setCreated( true );
    } catch ( e: any ) {
      addErrors( [ e.message ] );
      console.error( e );
    }

    setLoading( false );
  }

  return (
    <EscalationContext.Provider
      value={ {
        createEscalation,
        created,
        loading,
      } }>
      { children }
    </EscalationContext.Provider>
  );
};
