import ChatHeading from '../../Partials/ChatHeading';

export default function SearchSummary( { summary }: { summary: string } ) {
  return (
    <div className="space-y-2">
      <ChatHeading explanation="Provides an AI-generated overview of the search results, highlighting key topics and content types found on your site related to your query.">
        Summary
      </ChatHeading>
      <p className="text-brand-gray-70">{ summary }</p>
    </div>
  );
}
