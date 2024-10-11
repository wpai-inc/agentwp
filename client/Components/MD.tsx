import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import CodeToolbar from '@/Components/Chat/Convo/Message/CodeToolbar';
import { LightTheme } from '@/Components/Chat/Convo/Message/CodeTheme';
import { useEffect, useState } from 'react';
import transformMessageTextToHtml from './Chat/MessageBox/helpers/tranformMessageTextToHtml';

export default function MD( { content }: { content: string } ) {
  const [ tranformed, setTransformed ] = useState( content );

  useEffect( () => {
    setTransformed( transformMessageTextToHtml( content ) );
  }, [ content ] );

  return (
    <div className="prose w-full max-w-none overflow-hidden break-words text-base dark:prose-invert prose-p:text-base prose-code:break-all prose-code:rounded-md prose-code:border prose-code:border-amber-200 prose-code:bg-amber-50 prose-code:font-normal prose-code:text-amber-600 prose-code:before:hidden prose-code:after:hidden prose-pre:relative prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:rounded-none prose-pre:bg-transparent prose-pre:p-0">
      <Markdown
        children={ tranformed }
        remarkPlugins={ [ remarkBreaks, remarkRehype, remarkGfm ] }
        rehypePlugins={ [ rehypeRaw ] }
        components={ {
          code( props ) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec( className || '' );
            return match ? (
              <div className="rounded-xl">
                { children && <CodeToolbar code={ children.toString() } language={ match[ 1 ] } /> }

                <SyntaxHighlighter
                  { ...rest }
                  children={ String( children ).replace( /\n$/, '' ) }
                  showLineNumbers={ true }
                  style={ LightTheme }
                  language={ match[ 1 ] }
                  PreTag="pre"
                  CodeTag="span"
                />
              </div>
            ) : (
              <code { ...rest } className={ className }>
                { children }
              </code>
            );
          },
        } }
      />
    </div>
  );
}
