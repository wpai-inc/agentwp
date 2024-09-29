export default function ChatDisconnected( { inline = false }: { inline?: boolean } ) {
  return inline && <p>You must be connected.</p>;
}
