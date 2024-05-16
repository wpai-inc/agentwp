import ActionContainer from '../ActionContainer';

export default function ActionPending() {
  return (
    <ActionContainer pending={true}>
      <p>Thinking...</p>
    </ActionContainer>
  );
}
