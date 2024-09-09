import ChatHeading from '../../Partials/ChatHeading';
import IconLink from '@material-design-icons/svg/outlined/open_in_new.svg?react';

type SearchResult = {
  title: string;
  excerpt?: string;
  url: string;
  author?: string;
  date: string;
  thumbnail?: string;
};

export default function SearchResults( { results }: { results: SearchResult[] } ) {
  return (
    <div className="space-y-2 -mx-4">
      <ChatHeading
        className="px-4"
        explanation="Displays a list of relevant content items from your WordPress site that match your search query.">
        Results (30)
      </ChatHeading>
      <div className="divide-y divide-brand-gray border-b border-brand-gray">
        { results.map( ( result, index ) => (
          <Result key={ index } { ...result } />
        ) ) }
      </div>
    </div>
  );
}

function Result( { title, date, excerpt, thumbnail, url, author }: SearchResult ) {
  return (
    <a href={ url } className="flex gap-2 p-4 w-full group hover:bg-brand-gray transition">
      { thumbnail && (
        <img
          className="aspect-square h-full rounded"
          src={ thumbnail }
          alt={ title }
          width="75"
          height="75"
        />
      ) }
      <span className="flex-1 flex flex-col gap-2 overflow-hidden">
        <span className="text-lg font-semibold flex items-center justify-between">
          { title }
          <IconLink className="h-4 w-4 text-brand-gray-50 group-hover:text-brand-dark transition" />
        </span>
        { excerpt && <span className="truncate block">{ excerpt }</span> }
        <span className="flex items-center justify-between gap-2 text-sm text-brand-gray-70">
          { author && <span>{ author }</span> }
          <time>{ date }</time>
        </span>
      </span>
    </a>
  );
}
