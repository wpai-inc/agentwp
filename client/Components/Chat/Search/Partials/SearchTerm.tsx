import ChatHeading from '../../Partials/ChatHeading';

export default function SearchTerm() {
  return (
    <div className="bg-brand-gray p-4 pb-6 rounded-md space-y-2">
      <ChatHeading explanation="The natural language query you enter to find specific content or information on your WordPress site.">
        Search Term
      </ChatHeading>
      <blockquote className="text-3xl text-black">
        "Find my content on my site related to dogs"
      </blockquote>
    </div>
  );
}
