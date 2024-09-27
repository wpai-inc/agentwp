import { useState, useEffect } from 'react';
import IconCopy from '@material-design-icons/svg/outlined/content_copy.svg?react';
import useCopy from '@/Hooks/copy';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import WPCode from '@/assets/wpcode.png';
import WPCodeBox from '@/assets/wpcodebox.png';
import CodeSnippets from '@/assets/codesnippets.png';
import WoodySnippets from '@/assets/woodysnippets.png';
import { useError } from '@/Providers/ErrorProvider';
import { useChat } from '@/Providers/ChatProvider';
import { ChatNotice } from '@/Components/Chat/Notices/ChatNotice';
import { AgentTooltip } from '@/Components/ui/tooltip';
import PHP from '@/assets/svgs/php.svg';
import JS from '@/assets/svgs/js.svg';
import CSS from '@/assets/svgs/css.svg';
import HTML from '@/assets/svgs/html.svg';

const languageIcons: {
  [ key: string ]: string;
} = {
  php: PHP,
  js: JS,
  css: CSS,
  html: HTML,
};

export default function CodeToolbar( { code, language }: { code: string; language: string } ) {
  const { restReq } = useRestRequest();
  const { copy, copied } = useCopy();
  const [ pluginIcon, setPluginIcon ] = useState< string | null >( null );
  const { addErrors } = useError();
  const { snippetPlugin, setSnippetPlugin } = useChat();

  useEffect( () => {
    if ( ! snippetPlugin ) {
      getActiveCodeSnippetPlugin();
    }
  }, [] );

  useEffect( () => {
    switch ( snippetPlugin ) {
      case 'WPCode':
        setPluginIcon( WPCode );
        break;
      case 'WPCodeBox':
        setPluginIcon( WPCodeBox );
        break;
      case 'CodeSnippets':
        setPluginIcon( CodeSnippets );
        break;
      case 'WoodySnippets':
        setPluginIcon( WoodySnippets );
        break;
      default:
        setPluginIcon( null );
    }
  }, [ snippetPlugin ] );

  const getActiveCodeSnippetPlugin = async () => {
    try {
      const result = await restReq.get( 'code_snippet_plugin' );
      setSnippetPlugin( result.data.data );
    } catch ( e ) {
      // Do nothing
    }
  };

  const addSnippet = async () => {
    const data = {
      title: 'Code snippet by AgentWP',
      description: '',
      code,
      language,
    };

    try {
      const result = await restReq.post( 'add_snippet', data );
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
    <div className="not-prose">
      <ChatNotice
        noInitialAnimation={ true }
        className="mb-2 font-sans"
        size="sm"
        action={
          <a
            href="https://kb.agentwp.com/testing-code"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2">
            Learn More
          </a>
        }>
        Test code before using
      </ChatNotice>

      <div className="flex justify-between rounded-t-xl bg-brand-gray-25 p-2 text-brand-gray-70">
        <span className="text-sm uppercase">
          { languageIcons[ language.toLowerCase() ] ? (
            <img
              src={ languageIcons[ language.toLowerCase() ] }
              className="w-6 h-6"
              alt={ language }
            />
          ) : (
            language
          ) }
        </span>
        <div className="flex items-center justify-end gap-3">
          <AgentTooltip content="Copy code to clipboard.">
            <button
              className="hover:text-brand-gray-100 ml-2 text-xs"
              onClick={ () => copy( code ) }>
              { copied ? 'Copied!' : <IconCopy className="h-5 w-5" /> }
            </button>
          </AgentTooltip>

          { pluginIcon && (
            <AgentTooltip
              content="Make snippet from code in Code Snippets plugin."
              maxWidth={ 200 }>
              <button onClick={ addSnippet }>
                <img
                  src={ pluginIcon }
                  alt="WordPress Code Snippet"
                  className="w-5 h-5 grayscale hover:grayscale-0 transition"
                />
              </button>
            </AgentTooltip>
          ) }
        </div>
      </div>
    </div>
  );
}
