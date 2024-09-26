import Chat from '@/Components/Chat/Chat';

export default function ChatDisconnected( { inline = false }: { inline?: boolean } ) {
  return inline ? <p>You must be connected.</p> : <Chat />;
}
