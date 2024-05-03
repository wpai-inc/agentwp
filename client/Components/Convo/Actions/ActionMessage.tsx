import { MessageAction } from '@wpai/schemas';
import MD from '@/Components/MD';

export default function ActionMessage({ action }: { action: MessageAction }) {
  return <MD>{action?.text ?? 'something went wrong'}</MD>;
}
