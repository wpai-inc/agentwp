import SearchResults from './Partials/SearchResults';
import SearchStatus from './Partials/SearchStatus';
import SearchSummary from './Partials/SearchSummary';
import SearchTerm from './Partials/SearchTerm';

export default function SearchResponse() {
  return (
    <div className="px-4 max-w-screen-md space-y-4">
      <SearchTerm />
      <SearchStatus />
      <SearchResults />
      <SearchSummary />
    </div>
  );
}
