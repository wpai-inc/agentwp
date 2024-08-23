import ActionContainer from './ActionContainer';

export default function ActionAborted() {
  return <ActionContainer pending={ false } title="Aborted" />;
}
