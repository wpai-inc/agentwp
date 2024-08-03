import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import CodeToolbar from '@/Components/Chat/Convo/Message/CodeToolbar';
import { LightTheme } from '@/Components/Chat/Convo/Message/CodeTheme';

export default function MD( { content }: { content: string } ) {
  return (
    <div className="prose w-full max-w-none overflow-hidden break-words dark:prose-invert prose-code:break-all prose-pre:relative prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:rounded-none prose-pre:bg-transparent prose-pre:p-0">
      <Markdown
        children={ content }
        remarkPlugins={ [ remarkBreaks, remarkRehype ] }
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
                  PreTag="div"
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
