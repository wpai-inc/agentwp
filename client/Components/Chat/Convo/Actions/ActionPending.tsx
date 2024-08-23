import ActionContainer from '@/Components/Chat/Convo/Actions/ActionContainer';

export default function ActionPending() {
  return <ActionContainer title={ 'Thinking...' } pending={ true } className={ 'bg-white' } />;
}
