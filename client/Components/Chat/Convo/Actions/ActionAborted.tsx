import ActionContainer from './ActionContainer';

export default function ActionAborted() {
  return (
    <ActionContainer pending={false}>
      <div className="flex items-center justify-between">
        <p>Aborted</p>
      </div>
    </ActionContainer>
  );
}
