import React, { createContext, FC, useContext, useState } from 'react';
import { TokenUsageStatus } from '@/Types/types';

interface ContextProps {
  errors: string[];
  clearErrors: () => void;
  addErrors: ( error: string[] ) => void;
}

export const ErrorContext = createContext< ContextProps | undefined >( undefined );

export function useError() {
  const errors = useContext( ErrorContext );
  if ( ! errors ) {
    throw new Error( 'useError must be used within ErrorProvider' );
  }
  return errors;
}

export const ErrorProvider: FC< { children: React.ReactNode } > = ( { children } ) => {
  const [ errors, setErrors ] = useState< any[] >( [] );

  const addErrors = ( errors: string[] ) => {
    setErrors( prev => {
      return [
        ...prev,
        ...errors.map( ( err: any ) => {
          const message = err.response?.data?.message ?? err.message ?? err;
          const usageStatus = err.response?.data?.usage_status;
          const usageCooldownTime = err.response?.data?.usage_cooldown_time;

          let fullMessage = message;

          if ( usageStatus === TokenUsageStatus.ThrottledSite && usageCooldownTime ) {
            const date = new Date( usageCooldownTime );
            const formattedTime = new Intl.DateTimeFormat( 'en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            } ).format( date );
            fullMessage = `${ message } Please get back at ${ formattedTime }.`;
          }

          return {
            id: err.id ?? crypto.randomUUID(),
            message: fullMessage,
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
