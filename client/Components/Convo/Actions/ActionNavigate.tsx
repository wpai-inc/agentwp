import { NavigateAction } from '@wpai/schemas';
import ActionContainer from '../ActionContainer';

export default function ActionMessage({ action }: { action: NavigateAction }) {
  return (
    <ActionContainer pending={!action.final}>
      <p>
        Navigated to <strong>{action.url}</strong>
      </p>
    </ActionContainer>
  );
}
