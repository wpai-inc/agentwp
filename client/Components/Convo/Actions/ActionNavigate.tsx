import { NavigateAction } from '@wpai/schemas';

export default function ActionNavigate({ action }: { action: NavigateAction }) {
  return <p>Navigated to {action.url}</p>;
}
