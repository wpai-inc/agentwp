import SearchResults from './Partials/SearchResults';
import SearchStatus from './Partials/SearchStatus';
import SearchSummary from './Partials/SearchSummary';
import SearchTerm from './Partials/SearchTerm';
import { useSearch } from '@/Providers/SearchProvider';

export default function SearchResponse() {
  const { query } = useSearch();
  return (
    <div className="px-4 max-w-screen-md space-y-4">
      { query && <SearchTerm term={ query } /> }
      <SearchStatus />
      <SearchResults />
      <SearchSummary />
    </div>
  );
}
