import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  getSelectedGutenbergBlock,
  getSelectedInputField,
  getSelectedPostTitle,
} from '@/Services/SelectedFields';
import type { streamableFieldType } from '@/Types/types';

declare const wp: any;

type ContextProps = {
  selectedInput: streamableFieldType | null;
  setSelectedInput: React.Dispatch< React.SetStateAction< streamableFieldType | null > >;
};
export const InputSelectContext = createContext< ContextProps | undefined >( undefined );

export const useInputSelect = () => {
  const inputSelect = useContext( InputSelectContext );
  if ( inputSelect === undefined ) {
    throw new Error( 'useInputSelect must be used within InputSelectProvider' );
  }
  return inputSelect;
};

export const InputSelectProvider = ( { children }: { children: ReactNode } ) => {
  const [ selectedInput, setSelectedInput ] = useState< streamableFieldType | null >( null );

  useEffect( () => {
    getSelectedInputField( setSelectedInput );
    getSelectedGutenbergBlock( setSelectedInput );
    getSelectedPostTitle( setSelectedInput );
  }, [] );

  return (
    <InputSelectContext.Provider
      value={ {
        selectedInput,
        setSelectedInput,
      } }>
      { children }
    </InputSelectContext.Provider>
  );
};
