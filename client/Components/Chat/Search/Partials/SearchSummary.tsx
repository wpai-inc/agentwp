import ChatHeading from '../../Partials/ChatHeading';
import { useTranslation } from 'react-i18next';

export default function SearchSummary( { summary }: { summary: string } ) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <ChatHeading explanation="Provides an AI-generated overview of the search results, highlighting key topics and content types found on your site related to your query.">
        { t( 'Summary' ) }
      </ChatHeading>
      <p className="text-brand-gray-70">{ summary }</p>
    </div>
  );
}
