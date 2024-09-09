import SearchResults from './Partials/SearchResults';
import SearchStatus from './Partials/SearchStatus';
import SearchSummary from './Partials/SearchSummary';
import SearchTerm from './Partials/SearchTerm';
import { useSearch } from '@/Providers/SearchProvider';
import { AnimatePresence } from 'framer-motion';

export default function SearchResponse() {
  const { query, results, pending, summary } = useSearch();
  const hasResults = results && results.length > 0;
  return (
    <div className="px-4 max-w-screen-md space-y-4">
      { query && (
        <AnimatePresence>
          <SearchTerm term={ query } />
        </AnimatePresence>
      ) }
      { ( pending || hasResults ) && <SearchStatus pending={ pending } /> }
      { hasResults && (
        <>
          <SearchResults results={ results } />
          { summary && <SearchSummary summary={ summary } /> }
        </>
      ) }
    </div>
  );
}
