import { useState, useEffect } from 'react';
import IconCopy from '@material-design-icons/svg/outlined/content_copy.svg?react';
import useCopy from '@/Hooks/copy';
import { useAdminRoute } from '@/Providers/AdminRouteProvider';
import WPCode from '@/assets/wpcode.png';
import WPCodeBox from '@/assets/wpcodebox.png';
import CodeSnippets from '@/assets/codesnippets.png';
import { useError } from '@/Providers/ErrorProvider';

export default function CodeToolbar( { code, language }: { code: string; language: string } ) {
  const adminRequest = useAdminRoute();
  const { copy, copied } = useCopy();
  const [ plugin, setPlugin ] = useState< string | null >( null );
  const [ pluginIcon, setPluginIcon ] = useState< string | null >( null );
  const { addErrors } = useError();

  useEffect( () => {
    getActiveCodeSnippetPlugin();
  }, [] );

  useEffect( () => {
    switch ( plugin ) {
      case 'WPCode':
        setPluginIcon( WPCode );
        break;
      case 'WPCodeBox':
        setPluginIcon( WPCodeBox );
        break;
      case 'CodeSnippets':
        setPluginIcon( CodeSnippets );
        break;
      default:
        setPluginIcon( null );
    }
  }, [ plugin ] );

  const getActiveCodeSnippetPlugin = async () => {
    const result = await adminRequest.get( 'code_snippet_plugin' );
    setPlugin( result.data.data );
  };

  const addSnippet = async () => {
    const data = {
      title: 'Code snippet by AgentWP',
      description: '',
      code,
      language,
    };

    try {
      const result = await adminRequest.post( 'add_snippet', data );
      if ( result.data.success ) {
        window.location.href = result.data.data;
      } else {
        addErrors( [ result.data.message ] );
      }
    } catch ( e ) {
      addErrors( [ 'Failed to add code snippet' ] );
    }
  };

  return (
    <div className="flex justify-between p-2 bg-brand-gray-25 text-brand-gray-70 rounded-t-xl">
      <span className="text-sm uppercase">{ language }</span>
      <div className="flex items-center justify-end gap-3">
        <button className="ml-2 text-xs hover:text-brand-gray-100" onClick={ () => copy( code ) }>
          { copied ? 'Copied!' : <IconCopy className="w-4 h-4" /> }
        </button>

        { pluginIcon && (
          <button onClick={ addSnippet }>
            <img src={ pluginIcon } alt="WordPress Code Snippet" className="w-6 m-0" />
          </button>
        ) }
      </div>
    </div>
  );
}
