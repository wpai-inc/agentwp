import { useTranslation } from 'react-i18next';

export default function ChatDisconnected( { inline = false }: { inline?: boolean } ) {
  const { t } = useTranslation();
  return inline && <p>{ t( 'You must be connected.' ) }</p>;
}
