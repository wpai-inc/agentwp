import ChatHeading from '../../Partials/ChatHeading';

export default function SearchSummary() {
  return (
    <div className="space-y-2">
      <ChatHeading explanation="Provides an AI-generated overview of the search results, highlighting key topics and content types found on your site related to your query.">
        Summary
      </ChatHeading>
      <p className="text-brand-gray-70">
        { `Your site contains several articles about dog care and training. Popular topics include basic obedience commands [1], choosing the right dog food [2], and tips for grooming at home [3]. There's also a comprehensive guide on adopting a rescue dog [4]. These posts offer practical advice for both new and experienced dog owners.` }
      </p>
    </div>
  );
}
