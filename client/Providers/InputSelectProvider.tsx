import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  getSelectedGutenbergBlock,
  getSelectedInputField,
  getSelectedPostTitle,
} from '@/Services/SelectedFields';
import type { streamableFieldType } from '@/Types/types';
import { useScreen } from '@/Providers/ScreenProvider';

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
  const { screen, setScreen } = useScreen();

  useEffect( () => {
    getSelectedInputField( setSelectedInput );
    getSelectedGutenbergBlock( setSelectedInput );
    getSelectedPostTitle( setSelectedInput );
  }, [] );

  useEffect( () => {
    console.log( 'selectedInput', selectedInput );
    if ( selectedInput ) {
      const theScreen = { ...screen, selectedInput };
      if ( selectedInput.type === 'post_content' || selectedInput.type === 'post_title' ) {
        const postContent = wp.data.select( 'core/editor' ).getEditedPostContent();
        const postTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
        setScreen( { ...theScreen, post: { post_content: postContent, post_title: postTitle } } );
      } else {
        setScreen( theScreen );
      }
    }
  }, [ selectedInput ] );

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