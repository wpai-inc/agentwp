import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
  getSelectedGutenbergBlock,
  getSelectedInputField,
  getSelectedPostTitle,
} from '@/Services/SelectedFields';
import type { StreamableFieldType } from '@/Types/types';
import { useScreen } from '@/Providers/ScreenProvider';

declare const wp: any;

type ContextProps = {
  selectedInput: StreamableFieldType | null;
  setSelectedInput: React.Dispatch< React.SetStateAction< StreamableFieldType | null > >;
};
export const InputSelectContext = createContext< ContextProps | undefined >( undefined );

export const useInputSelect = () => {
  const inputSelect = useContext( InputSelectContext );
  return (
    inputSelect ?? {
      selectedInput: null,
      setSelectedInput: () => {},
    }
  );
};

export const InputSelectProvider = ( { children }: { children: ReactNode } ) => {
  const [ selectedInput, setSelectedInput ] = useState< StreamableFieldType | null >( null );
  const selectedInputRef = useRef< null | HTMLInputElement | HTMLTextAreaElement | HTMLElement >(
    null,
  );
  const { screen, setScreen } = useScreen();

  useEffect( () => {
    getSelectedInputField( setSelectedInput, selectedInputRef );
    getSelectedGutenbergBlock( setSelectedInput );
    getSelectedElementorBlock( setSelectedInput );
    getSelectedPostTitle( setSelectedInput );
  }, [] );

  useEffect( () => {
    if ( selectedInput ) {
      const theScreen = { ...screen, selectedInput };
      if ( selectedInput.type === 'post_content' || selectedInput.type === 'post_title' ) {
        const postContent = wp.data.select( 'core/editor' ).getEditedPostContent();
        const postTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
        setScreen( { ...theScreen, post: { post_content: postContent, post_title: postTitle } } );
      } else {
        setScreen( theScreen );
      }
    } else {
      // remove selectedInput from screen
      const { selectedInput, ...rest } = screen;
      setScreen( rest );
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
