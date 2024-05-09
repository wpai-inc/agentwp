import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MD({ children }: { children: string }) {
  return (
    <div className="prose">
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </div>
  );
}
