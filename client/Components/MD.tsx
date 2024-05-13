import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MD({ content }: { content: string }) {
  return (
    <div className="prose">
      <Markdown remarkPlugins={[remarkGfm]} children={content} />
    </div>
  );
}
