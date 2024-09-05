import ChatHeading from '../../Partials/ChatHeading';

export default function SearchTerm( { term }: { term: string } ) {
  return (
    <div className="bg-brand-gray p-4 pb-6 rounded-md space-y-2">
      <ChatHeading explanation="The natural language query you enter to find specific content or information on your WordPress site.">
        Search Term
      </ChatHeading>
      <blockquote className="text-3xl text-black">"{ term }"</blockquote>
    </div>
  );
}
