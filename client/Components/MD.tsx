import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MD({ children }: { children: string }) {
  return <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>;
}
