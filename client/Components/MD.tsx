import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MD( { content }: { content: string } ) {
  return (
    <div className="prose leading-tight text-sm max-w-none">
      <Markdown remarkPlugins={ [ remarkGfm ] } children={ content } />
    </div>
  );
}
