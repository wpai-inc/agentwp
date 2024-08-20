import React, { useEffect, useState } from 'react';
import { useStream } from '@/Providers/StreamProvider';
import { CleanGutenbergContent, WriteToEditor } from '@/Services/WriteToEditor';
import { CleanInputFieldContent, WriteToInputField } from '@/Services/WriteToInputField';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import type { AgentAction } from '@/Providers/UserRequestsProvider';
import { type BlockType } from '@/Types/types';
import { useChat } from '@/Providers/ChatProvider';
import { useInputSelect } from '@/Providers//InputSelectProvider';
import { CleanWysiwygContent, WriteToWysiwyg } from '@/Services/WriteToWysiwyg';

const StreamListenerProvider: React.FC< { children: React.ReactNode } > = ( { children } ) => {
  const { updateAgentMessage } = useChat();
  const { selectedInput } = useInputSelect();
  const { currentUserRequestId } = useUserRequests();
  const { liveAction } = useStream();
  const [ editorContent, setEditorContent ] = useState< BlockType[] >( [] );
  const [ startingStreaming, setStartingStreaming ] = useState( {
    userRequestId: '',
    liveAction: null as AgentAction | null,
  } );

  useEffect( () => {
    if ( liveAction && currentUserRequestId ) {
      if ( startingStreaming.userRequestId !== currentUserRequestId ) {
        setStartingStreaming( {
          userRequestId: currentUserRequestId,
          liveAction,
        } );
      }
      if ( liveAction.action.ability === 'write_to_editor' && liveAction.action.text ) {
        const text = liveAction.action.text.replace( /```json/g, '' ).replace( /```/g, '' );
        const newEditorContent = WriteToEditor( text, editorContent );
        if ( newEditorContent?.content ) {
          setEditorContent( newEditorContent.content );
        }

        if ( newEditorContent?.summary ) {
          liveAction.action.ability = 'message';
          liveAction.action.text = newEditorContent.summary;
          updateAgentMessage( currentUserRequestId, liveAction );
        }
      } else if (
        liveAction.action.ability === 'write_to_input' &&
        liveAction.action.text &&
        selectedInput
      ) {
        const text = liveAction.action.text.replace( /```json/g, '' ).replace( /```/g, '' );

        let newInputFieldContent;

        console.log( 'selectedInput.type', selectedInput.type );
        if ( selectedInput.type === 'WYSIWYG' ) {
          newInputFieldContent = WriteToWysiwyg( text, selectedInput );
        } else {
          newInputFieldContent = WriteToInputField( text, selectedInput );
        }

        if ( newInputFieldContent?.summary ) {
          liveAction.action.ability = 'message';
          liveAction.action.text = newInputFieldContent.summary;
          updateAgentMessage( currentUserRequestId, liveAction );
        }
      } else if ( liveAction.action.ability === 'message' ) {
        updateAgentMessage( currentUserRequestId, liveAction );
      }
    }
  }, [ liveAction, currentUserRequestId, selectedInput ] );

  useEffect( () => {
    if ( startingStreaming.liveAction?.action.ability === 'write_to_editor' ) {
      CleanGutenbergContent();
    } else if ( startingStreaming.liveAction?.action.ability === 'write_to_input' ) {
      if ( selectedInput?.type === 'WYSIWYG' ) {
        CleanWysiwygContent( selectedInput );
      } else {
        CleanInputFieldContent( selectedInput );
      }
    }
  }, [ startingStreaming ] );

  return <>{ children }</>;
};

export default StreamListenerProvider;
