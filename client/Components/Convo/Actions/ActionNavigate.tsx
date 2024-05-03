import { NavigateAction } from '@wpai/schemas';

export default function ActionMessage({ action }: { action: NavigateAction }) {
  return <p>Navigated to {action.url}</p>;
}
