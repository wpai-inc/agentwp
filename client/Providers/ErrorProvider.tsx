import React, { createContext, FC, useContext, useState } from 'react';
import { useApp } from '@/Providers/AppProvider';
import { TokenUsageStatus } from '@/Types/enums';

interface ContextProps {
  errors: ChatErrorType[];
  clearErrors: () => void;
  addErrors: ( error: string[] ) => void;
}

export type ChatErrorType = {
  id: string;
  message: string;
};

export const ErrorContext = createContext< ContextProps | undefined >( undefined );

export function useError() {
  const errors = useContext( ErrorContext );
  if ( ! errors ) {
    throw new Error( 'useError must be used within ErrorProvider' );
  }
  return errors;
}

export const ErrorProvider: FC< { children: React.ReactNode } > = ( { children } ) => {
  const [ errors, setErrors ] = useState< ChatErrorType[] >( [] );
  const { setCooldownTime, setTokenUsageStatus } = useApp();

  const addErrors = ( errors: string[] ) => {
    setErrors( prev => {
      return [
        ...prev,
        ...errors.map( ( err: any ) => {
          try {
            // Remove error message from the console
            err = JSON.parse( err.message );
          } catch ( e ) {
            // Do nothing
          }

          const message = err.response?.data?.message ?? err.message ?? err;
          const actionText = err?.action_txt || null;
          const actionUrl = err?.action_url || null;
          const usageCooldownTime = err.response?.data?.usage_cooldown_time;
          const usageStatus = err.response?.data?.usage_status as TokenUsageStatus;

          if ( usageCooldownTime && usageStatus ) {
            setCooldownTime( new Date( usageCooldownTime ) );
            setTokenUsageStatus( usageStatus );
          }

          return {
            id: err.id ?? crypto.randomUUID(),
            message: message,
            actionText,
            actionUrl,
          };
        } ),
      ];
    } );
    setTimeout( () => {
      clearErrors();
    }, 5000 );
  };

  const clearErrors = () => {
    setErrors( [] );
  };

  return (
    <ErrorContext.Provider
      value={ {
        errors,
        clearErrors,
        addErrors,
      } }>
      { children }
    </ErrorContext.Provider>
  );
};
